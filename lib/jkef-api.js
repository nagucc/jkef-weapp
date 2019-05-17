/**
 * JKEF-API
 * version：1.0.0
 */

class JkefApi {
  constructor(options) {
    this.host = options.host;
    this.token = options.token;
    this.version = options.version;
  }

    // 获取Acceptor列表
    listAcceptors(options){
      options = Object.assign({}, {
        pageIndex: 0,
        pageSize: 1000,
        project: '',
        year: '',
      }, options);
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${this.host}/acceptors/list/${options.pageIndex}?pageSize=${options.pageSize}&project=${options.project}&year=${options.year}&token=${this.token}`,
          success: res => {
            if (res.data.ret === 0) {
              resolve(res.data.data);
            } else reject(res.data);
          },
          fail: function (res) {
            reject({ ret: 0, msg: res });
          }
        });
      })
    }

    // 获取录取信息列表
    listCeeInfo(options) {
      options = Object.assign({}, {
        pageIndex: 0,
        pageSize: 1000,
      }, options);
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${this.host}/cee/list/${options.pageIndex}?pageSize=${options.pageSize}&token=${this.token}`,
          header: {
            'x-app-version': this.version,
          },
          success: res => {
            if (res.data.ret === 0) {
              resolve(res.data.data);
            } else reject(res.data);
          },
          fail: function (res) {
            reject({ ret: 0, msg: res });
          }
        });
      });
    }

    // 添加录取信息
    addCeeInfo(ceeInfo){
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${this.host}/cee?token=${this.token}`,
          method: 'PUT',
          data: ceeInfo,
          header: {
            'content-type': 'application/json',
            'x-app-version': this.version,
          },
          success: res => {
            if (res.data.ret === 0) {
              resolve(res.data.data);
            } else reject(res.data);
          },
          fail: function (res) {
            reject({ ret: 0, msg: res });
          }
        });
      });
    }

    // 获取最新活动
    events() {
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${this.host}/events/wxapp?token=${this.token}`,
          header: {
            'x-app-version': this.version,
          },
          success: res => {
            if (res.data.ret === 0) {
              resolve(res.data.data);
            } else reject(res.data);
          },
          fail: function (res) {
            reject({ ret: 0, msg: res });
          }
        });
      });
    }

    // 获取用户的录取信息
    findCeeInfoByUser(appId, userId) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${this.host}/cee/app/${appId}/user/${userId}?token=${this.token}`,
          header: {
            'x-app-version': this.version,
          },
          success: res => {
            if (res.data.ret === 0) {
              resolve(res.data.data);
            } else reject(res.data);
          },
          fail: function (res) {
            reject({ ret: 0, msg: res });
          }
        });
      });
    }

    // 删除录取信息
    removeCeeInfo(id) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${this.host}/cee/${id}?token=${this.token}`,
          header: {
            'x-app-version': this.version,
          },
          method: 'DELETE',
          success: res => {
            if (res.data.ret === 0) {
              resolve(res.data.data);
            } else reject(res.data);
          },
          fail: function (res) {
            reject({ ret: 0, msg: res });
          }
        });
      });
    }

    // 更新录取信息
    updateCeeInfo(ceeInfo) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: `${this.host}/cee/${ceeInfo._id}?token=${this.token}`,
          method: 'POST',
          data: ceeInfo,
          header: {
            'content-type': 'application/json',
            'x-app-version': this.version,
          },
          success: res => {
            if (res.data.ret === 0) {
              resolve(res.data.data);
            } else reject(res.data);
          },
          fail: function (res) {
            reject({ ret: 0, msg: res });
          }
        });
      });
    }
}

module.exports = JkefApi;