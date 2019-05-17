const { jkef, wxapp, acceptorApi } = require('../../../config');

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    acceptor: {},
    selectedIdCardTypeIndex: 0,
    idCardTypes: jkef.idCardTypes,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if(options)
    // wx.showLoading({
    //   title: '数据加载中',
    //   mask: true,
    // });
    // 当用户在搜索不到指定受赠者，会点击“创建”按钮，并带入一个name参数。
    if (options.name) {
      this.setData({
        acceptor: Object.assign({}, this.data.acceptor, {
          name: options.name,
        }),
      });
    }

    // 当用户点击“编辑基本信息”按钮，会带入一个id参数，进行编辑。
    if (options.id) {
      acceptorApi.getById(options.id).then(acceptor => {
        const type = (acceptor.idCard || {}).type;
        let selectedIdCardTypeIndex = jkef.idCardTypes.indexOf(type);
        if (selectedIdCardTypeIndex === -1) selectedIdCardTypeIndex = 0;
        this.setData({
          acceptor,
          selectedIdCardTypeIndex,
        });
      });
    }
    app.getUserInfo().then(userInfo => {
      this.setData({ userInfo });
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
  bindIdCardTypeChange(e) {
    const selectedIdCardTypeIndex = e.detail.value;
    this.setData({ selectedIdCardTypeIndex });
  },
  formSubmit(e) {
    // 数据整理
    const {name, phone, homeAddress, idCardTypeIndex, idCardNumber} = e.detail.value;
    const acceptor = {
      name,
      phone,
      homeAddress,
      idCard: {
        type: jkef.idCardTypes[parseInt(idCardTypeIndex)],
        number: idCardNumber,
      },
    }

    // 数据检查
    let errMsg = '';
    if (!idCardNumber) errMsg = '请填写证件号码';
    if (!parseInt(idCardTypeIndex)) errMsg = '请选择证件类型';
    if (!name) errMsg = "请填写姓名";
    if (errMsg) {
      wx.showModal({
        title: '出错了',
        content: errMsg,
        showCancel: false,
      });
      return;
    }

    // 添加数据
    wx.showLoading({
      title: '正在处理数据',
      mask: true,
    });
    const pAddOrUpdate = new Promise((resolve, reject) => {
      if (this.data.acceptor._id) {
        // 更新现有Acceptor对象
        console.log('acceptor:', this.data.acceptor._id);
        acceptorApi.updateById(this.data.acceptor._id, acceptor).then(result => {
          resolve(this.data.acceptor._id);
        }).catch(err => {
          reject(err);
        });
      } else {
        // 添加新的Acceptor对象
        acceptorApi.add(acceptor).then(result => {
          resolve(result._id);
        }).catch(err => {
          reject(err);
        });
      }
    });
    pAddOrUpdate.then(id => {
      wx.hideLoading();
      wx.redirectTo({
        url: `/pages/acceptors/detail/detail?id=${id}`,
      });
    }).catch(err => {
      wx.hideLoading();
      console.log(err);
      wx.showModal({
        title: '添加失败',
        content: `远程服务器错误：${err.msg}`,
        showCancel: false,
      });
    });
  }
})