/**
 * JKEF受赠者API
 * version: 1.1.0
 * 
 */

const { get, set } = require('../storage.js');

class AcceptorApi {

  constructor(options) {
    this.host = options.host;
    this.token = options.token;
    this.version = options.version;
  }

  // 获取Acceptor列表
  list(options) {
    options = Object.assign({}, {
      pageIndex: 0,
      pageSize: 10000,
      project: '',
      year: '',
      text: '',
    }, options);
    return wx.cloud.callFunction({
      name: 'getAcceptors',
    }).then(res => {
      let data = res.result.data;
      // 根据project进行过滤
      if (options.project) {
        data = data.filter(acc => {
          const { records } = acc;
          if (!records) return false;
          return records.some(record => record.project == options.project)
        });
      }
      // 根据年份进行过滤
      if (options.year) {
        data = data.filter(acc => {
          const { records } = acc;
          if (!records) return false;
          return records.some(record => {
            const date = new Date(record.date);
            return date.getFullYear() === options.year;
          });
        });
      }
      // 根据输入信息(姓名，电话)进行过滤
      if (options.text) {
        data = data.filter(acc => {
          return (acc.name || '').includes(options.text)
            || (acc.phone || '').includes(options.text);
        });
      }
      return Promise.resolve({
        data, 
        totalCount: data.length,
      });
    });

  }

  // 获取Acceptor
  getById(id) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getAcceptorById',
        data: {
          _id: id
        },
      }).then(res => {
        if (res.result) resolve(res.result);
        else reject({ ret: 0, msg: '未知错误' });
      })
    });
  }

  /*
    添加受助者。
    示例数据：
    {
      name: 'xxx',
      phone: 'phone',
    }
  */
  add(acceptor) {
    return wx.cloud.callFunction({
      name: 'addAcceptor',
      data: acceptor,
    }).then(res => {
      if (!res.result.ret) return Promise.resolve(res.result.data);
      else return Promise.reject(res.data);
    }).catch(err => {
      return Promise.reject({
        ret: -1,
        msg: 'acceptor-add错误',
      });
    });
  }

  /*
    更新受助者
  */
  updateById(id, acceptor) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/${id}?token=${this.token}`,
        method: 'POST',
        data: acceptor,
        header: {
          'content-type': 'application/json',
          // 'x-app-version': this.version,
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

  remove(id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/${id}?token=${this.token}`,
        method: 'DELETE',
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

  addRecord(id, record) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/record/${id}?token=${this.token}`,
        method: 'PUT',
        data: record,
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

  removeRecord(id, recordId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/record/${id}/${recordId}?token=${this.token}`,
        method: 'DELETE',
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

  // 添加教育经历
  addEdu(id, edu) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/edu/${id}?token=${this.token}`,
        method: 'PUT',
        data: edu,
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

  removeEdu(id, edu) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/edu/remove/${id}?token=${this.token}`,
        method: 'POST',
        data: edu,
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

  // 添加工作经历
  addCareer(id, career) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/career/${id}?token=${this.token}`,
        method: 'PUT',
        data: career,
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

  removeCareer(id, career) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.host}/career/remove/${id}?token=${this.token}`,
        method: 'POST',
        data: career,
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

module.exports = AcceptorApi;