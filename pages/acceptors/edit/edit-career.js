const { jkef: { degrees }, acceptorApi } = require('../../../config');

const defaultAddFormData = {
  year: '',
  name: '',
};

/*
对教育经历进行排序的方法
*/
const sortRecord = (a, b) => {
  return a.year > b.year ? 1 : -1;
};

// 生成删除受赠记录的picker需要的range参数
const generateDeletePickerRange = records => {
  records.sort(sortRecord);
  return [{
    text: '请选择',
    career: {},
  }].concat(((records || []).map((career) => {
    return {
      text: `${career.year}|${career.name}`,
      career,
    }
    })));
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    degrees: ['请选择'].concat(degrees),
    addFormData: defaultAddFormData,
    careerHistory: [],
    acceptor: {},
    recordsForDelete: [{
      text: '请选择',
      career: {},
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
        careerHistory: (acceptor.careerHistory || []).sort(sortRecord),
        recordsForDelete: generateDeletePickerRange(acceptor.careerHistory || []),
      });
      wx.hideLoading();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  bindAddFormFieldChange(e) {
    const { id } = e.target;
    this.setData({
      addFormData: Object.assign({}, this.data.addFormData, {
        [id]: e.detail.value,
      }),
    });
  },

  submitAdd(e) {

    // 准备数据
    const { name, year } = e.detail.value;

    // 数据检查
    let errMsg = '';
    if (!name) errMsg = '请填写单位名称';
    if (!year || !parseInt(year)) errMsg = '请正确填写入职年份';
    if (errMsg) {
      wx.showModal({
        title: '出错了',
        content: errMsg,
        showCancel: false,
      });
      return;
    }

    const record = {
      year: parseInt(year),
      name,
    };

    // 添加数据
    wx.showLoading({
      title: '正在处理数据',
      mask: true,
    });
    acceptorApi.addCareer(this.data.acceptor._id, record).then(result => {
      const careerHistory = this.data.careerHistory.concat(record);
      this.setData({
        careerHistory,
        addFormData: defaultAddFormData,
        recordsForDelete: generateDeletePickerRange(careerHistory),
      });
      wx.hideLoading();
      wx.showToast({
        title: '添加成功',
        icon: 'success',
      });
    });
  },

  bindRecordForDeleteChange(e) {
    this.setData({
      selectedRecordIndex: parseInt(e.detail.value),
    });
  },

  submitDelete(e) {
    const { selectedRecordIndex, recordsForDelete, acceptor, careerHistory } = this.data;
    const record = recordsForDelete[selectedRecordIndex];

    wx.showModal({
      title: '警告',
      content: `记录删除后将无法恢复，确定要删除【${acceptor.name}】的工作经历【${record.text}】吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在处理',
            mask: true,
          });
          acceptorApi.removeCareer(acceptor._id, record.career).then(result => {
            wx.hideLoading();
            this.setData({
              careerHistory: careerHistory.filter(({name, year}) =>
                (name != record.career.name && year !== record.career.year)),
              recordsForDelete: recordsForDelete.filter(({ text }) =>
                (text !== record.text)),
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
})