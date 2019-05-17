const moment = require('../../lib/moment');
const { formatMoney } = require('../../lib/accounting');
const { jkefApi, jkef } = require('../../config');


const app = getApp();
Page({
  data: {
    statByProject: [],
    statByYear: [],
    total: {},
    latestUpdate: null,
    events: [],
  },
  onLoad: function () {
    if (!this.data.statByProject.length) this.prepareStatData();
  },
  onPullDownRefresh: function () {
    this.prepareStatData().then((result) => {
      wx.stopPullDownRefresh();
    });
  },

  //
  prepareStatData() {
    // 显示toast
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    const db = wx.cloud.database()
    const colYearStat = db.collection('stat_by_year').orderBy('_id', 'asc');
    const colProjectStat = db.collection('stat_by_project');
    return Promise.all([
      colProjectStat.get(),
      colYearStat.get(),
    ]).then(([
      statByProject,
      statByYear,
    ]) => {
      // 生成统计信息
      const total = statByProject.data.reduce((acc, cur) => {
        acc.amount += cur.value.amount;
        acc.count += cur.value.count;
        return acc;
      }, { amount: 0, count: 0 });
      const latestUpdate = statByProject.data.reduce((acc, cur) => {
        return acc.isAfter(moment(cur.value.lastUpdated)) ? acc : moment(cur.value.lastUpdated);
      }, moment('2006-01-01'));

      //更新数据
      this.setData({
        // userInfo,
        statByProject: statByProject.data.map(item => Object.assign(item, {
          value: Object.assign(item.value, {
            amount: formatMoney(item.value.amount, '￥'),
          }),
        })),
        total: Object.assign(total, {
          amount: formatMoney(total.amount, '￥'),
        }),
        latestUpdate: latestUpdate.format('YYYY-MM-DD'),
        // events,
        statByYear: statByYear.data.map(item => Object.assign(item, {
          value: Object.assign(item.value, {
            amount: formatMoney(item.value.amount, '￥'),
          }),
        })),
        // isManager: userInfo.roles.includes(jkef.roles.MANAGER),
      });
      // 隐藏toast
      wx.hideLoading();
      return Promise.resolve([statByProject.data, statByYear.data, /*userInfo, events*/]);
    });
  },
  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function () {

  },
});