const { jkef, wxapp, acceptorApi } = require('../../../config');
const moment = require('../../../lib/moment')
const { formatMoney } = require('../../../lib/accounting');

/*
格式化受赠记录为可显示的格式，同时保留原始字段。
此方法具有等幂性。
*/
const formatRecord = record => {
  return Object.assign(
    {},
    record,
    {
      year: moment(record.date).year(),
      amountText: formatMoney(record.amount / 1000, '￥'),
      dateText: moment(record.date).format('YYYY-MM-DD'),
    }
  );
};

const defaultAddFormData = {
  selectedProjectIndex: 0,
  selectedDate: moment().format('YYYY-MM-DD'),
  amount: '',
  recommander: '',
  remark: '',
};

/*
对记录进行排序的方法
*/
const sortRecord = (a, b) => {
  const aDate = moment(a.date);
  const bDate = moment(b.date);
  return aDate.isAfter(bDate) ? 1 : -1;
};

// 生成删除受赠记录的picker需要的range参数
const generateDeletePickerRange = records => {
  records.sort(sortRecord);
  return [{
    text: '请选择',
    _id: '',
  }].concat(((records || []).map(formatRecord).map(({ _id, year, project, amountText }) => {
    return {
      _id,
      text: `${year}|${project}|${amountText}`,
    }
    })));
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    acceptor: {},
    records: [],
    projects: ['请选择'].concat(jkef.projects),
    dateEnd: moment().format('YYYY-MM-DD'),
    addFormData: defaultAddFormData,
    recordsForDelete: [{
      text: '请选择',
      id: '',
    }],
    selectedRecordIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    

    wx.showLoading({
      title: '数据加载中',
      mask: true,
    });
    acceptorApi.getById(options.id).then(acceptor => {
      this.setData({
        acceptor,
        records: (acceptor.records || []).map(formatRecord).sort(sortRecord),
        recordsForDelete: generateDeletePickerRange(acceptor.records || []),
      });
      wx.hideLoading();
    });
  },

  submitAdd(e) {
    console.log(e.detail.value);

    // 准备数据
    const { projectIndex, date, amount, recommander, remark } = e.detail.value;

    // 数据检查
    let errMsg = '';
    if (!amount || !parseFloat(amount)) errMsg = '请正确填写金额';
    if (projectIndex === '0') errMsg = '请选择项目';
    if (errMsg) {
      wx.showModal({
        title: '出错了',
        content: errMsg,
        showCancel: false,
      });
      return;
    }

    const record = {
      project: this.data.projects[projectIndex],
      date,
      amount: parseFloat(amount),
      recommander,
      remark,
    };

    // 添加数据
    wx.showLoading({
      title: '正在处理数据',
      mask: true,
    });
    acceptorApi.addRecord(this.data.acceptor._id, record).then(result => {
      record._id = result;
      record.amount = parseFloat(amount) * 1000;
      const records = this.data.records.concat(formatRecord(record));
      this.setData({
        records,
        addFormData: defaultAddFormData,
        recordsForDelete: generateDeletePickerRange(records),
      });
      wx.hideLoading();
      wx.showToast({
        title: '添加成功',
        icon: 'success',
      });
    });
  },

  submitDelete(e) {
    const { selectedRecordIndex, recordsForDelete, acceptor, records } = this.data;
    const record = recordsForDelete[selectedRecordIndex];

    wx.showModal({
      title: '警告',
      content: `记录删除后将无法恢复，确定要删除【${acceptor.name}】的受赠记录【${record.text}】吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在处理',
            mask: true,
          });
          acceptorApi.removeRecord(acceptor._id, record._id).then(result => {
            wx.hideLoading();
            const filterFunc = ({ _id }) => _id !== record._id;
            this.setData({
              records: records.filter(filterFunc),
              recordsForDelete: recordsForDelete.filter(filterFunc),
              selectedRecordIndex: 0,
            });
            wx.showToast({
              title: '删除成功',
              icon: 'success',
            });
          });
        }
      },
    });
  },
  bindAddFormFieldChange(e) {
    const { id } = e.target;
    this.setData({
      addFormData: Object.assign({}, this.data.addFormData, {
        [id]: e.detail.value,
      }),
    });
  },

  bindRecordForDeleteChange(e) {
    console.log(e.detail.value);
    this.setData({
      selectedRecordIndex: parseInt(e.detail.value),
    });
  }
})