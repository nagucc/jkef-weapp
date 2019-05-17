const { jkefApi } = require('../../../config.js');
// const JkefApi = require('../../../lib/jkef-api');
const app = getApp();
// const jkefApi = new JkefApi();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    });
    app.getUserInfo().then(userInfo => {
      app.getCeeInfo().then(ceeInfo => {
        wx.hideLoading();
        this.setData({
          ceeInfo,
        });
      });
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


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  removeCeeInfo() {
    wx.showModal({
      title: '确认操作',
      content: '您确定要删除记录吗？',
      showCancel: true,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '操作中',
            mask: true,
          });
          wx.removeStorageSync('current-user-cee-info');
          jkefApi.removeCeeInfo(this.data.ceeInfo._id).then(result => {
            wx.hideLoading();
            wx.switchTab({
              url: '/pages/user/profile/profile',
            });
          });
        }
      },
    })
  }
})