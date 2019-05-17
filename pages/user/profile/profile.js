const { jkef, jkefApi, weixinApi, uirApi, wxapp } = require('../../../config');

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isManager: false,
    events: [],
  },

  // 页面启动时，尝试自动加载用户信息
  onShow: function() {
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    });
    weixinApi.getOpenId().then(openid => {
      const col = wx.cloud.database().collection('uir');
      col.get().then(uir => {
        wx.hideLoading();
        if (uir.data.length) { // 用户信息已记录过
          this.setData({
            userInfo: uir.data[0].userInfo,
            isManager: uir.data[0].roles.includes(jkef.roles.MANAGER),
          });
        }
      });
    });
  },

  bindGetUserInfo: function(e) {
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    });

    const { userInfo } = e.detail;

    weixinApi.getOpenId().then(openid => {
      const col = wx.cloud.database().collection('uir');
      col.get().then(uir => {
        wx.hideLoading();
        if (uir.data.length) { // 用户信息已记录过
          this.setData({
            userInfo,
            isManager: uir.data[0].roles.includes(jkef.roles.MANAGER),
          });
        } else { // 还没记录过用户信息，立即记录一下
          col.add({
            data: {
              roles: ['jkef:visitor'],
              userInfo,
            }
          }).then(() => {
            this.setData({
              userInfo,
            });
          });
        }
      })
    });
  }
})