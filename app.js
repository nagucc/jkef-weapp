const { jkefApi, weixinApi, uirApi, wxapp } = require('./config');
App({
    globalData: {
        hasLogin: false,
    },
    onLaunch: function () {
      
    },
    getUserInfo: function() {
      if (this.globalData.userInfo) {
        return Promise.resolve(this.globalData.userInfo);
      }
      return new Promise((resolve, reject) => {
        // 获取openid及角色列表
        const colUir = wx.cloud.database().collection('uir');
        const pOpenIdAndRoles = colUir.get();
        // 获取用户基本信息
        const pUserInfo = weixinApi.getUserInfo();
        
        Promise.all([
          pOpenIdAndRoles,
          pUserInfo,
        ]).then(([
          openidAndRoles, userInfo
        ]) => {
          this.globalData.userInfo = Object.assign({}, {
            openid: openidAndRoles.data[0]._openid,
            roles: openidAndRoles.data[0].roles,
          }, userInfo)
          resolve(this.globalData.userInfo);
        });
      });
    },
    // 获取当前用户的录取信息
    getCeeInfo() {
      // const jkefApi = new JkefApi();
      const userId = this.globalData.userInfo.openid;
      let ceeInfo = wx.getStorageSync('current-user-cee-info');
      if (ceeInfo) {
        return Promise.resolve(ceeInfo);
      } else {
        return new Promise((resolve, reject) => {
          jkefApi.findCeeInfoByUser(wxapp.appId, userId).then(result => {
            wx.setStorageSync('current-user-cee-info', result);
            resolve(result);
          });
        });
      }
    }
});

wx.cloud.init({
  env: 'jkef'
})