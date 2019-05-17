const moment = require('../../../lib/moment')
const { formatMoney } = require('../../../lib/accounting');
const { wxapp, acceptorApi, jkefApi } = require('../../../config');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    acceptor: {},
    records: [],
    eduHistory: [],
    careerHistory: [],
    appId: wxapp.appId,
    options: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.id) options.id = '593786313a82d5001d5d9adb';
    this.setData({
      options,
    });
    this.prepareAcceptorData();
  },

  prepareAcceptorData() {
    const { options } = this.data;

    wx.showLoading({
      title: '数据加载中',
      mask: true,
    });
    acceptorApi.getById(options.id).then(acceptor => {
      acceptor.idCardNo = (acceptor.idCard || {}).number;
      this.setData({
        acceptor,
        records: (acceptor.records || []).map(record => {
          return Object.assign({}, record, {
            year: moment(record.date).year(),
            amountText: formatMoney(record.amount / 1000, '￥'),
            dateText: moment(record.date).format('YYYY-MM-DD'),
          });
        }),
        eduHistory: (acceptor.eduHistory || []).map(edu => {
          return Object.assign({}, edu, {

          });
        }),
        careerHistory: (acceptor.careerHistory || []).map(career => {
          return Object.assign({}, career, {

          });
        }),
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
    this.prepareAcceptorData();
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  openActionSheet() {
    const { acceptor } = this.data;
    wx.showActionSheet({
      itemList: [
        '基本信息',
        '教育经历',
        '工作经历',
        '奖赠记录'
      ],
      itemColor: '#000000',
      success: (res) => {
        switch(res.tapIndex) {
          case 0:
            wx.navigateTo({
              url: `/pages/acceptors/edit/edit?id=${acceptor._id}`,
            });
            break;
          case 1:
            wx.navigateTo({
              url: `/pages/acceptors/edit/edit-edu?id=${acceptor._id}`,
            });
            break;
          case 2:
            wx.navigateTo({
              url: `/pages/acceptors/edit/edit-career?id=${acceptor._id}`,
            });
            break;
          case 3:
            wx.navigateTo({
              url: `/pages/acceptors/edit-record/edit-record?id=${acceptor._id}`,
            });
            break;

        }
      },
    })
  },

  deleteAcceptor() {
    const { acceptor } = this.data;
    wx.showModal({
      title: '警告',
      content: `确定要删除【${acceptor.name}】吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '数据处理中',
            mask: true,
          });
          jkefApi.deleteAcceptor(acceptor._id).then(() => {
            wx.hideLoading();
            wx.redirectTo({
              url: '/pages/acceptors/list/list',
            });
          });
        }
      },
    });
  }
})