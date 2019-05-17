const moment = require('../../../lib/moment');
const { acceptorApi } = require('../../../config');

let timer;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    acceptors: [],
    totalCount: 0,
    projects: ['全部项目', '奖学金', '助学金', '其他'],
    selectedProjectIndex: 0,
    years: ['全部年度'].concat(
      (new Array(moment().year() - 2006 + 1))
        .fill(2006)
        .map((item, index) => (item + index))
    ),
    selectedYearIndex: 0,
    inputShowed: false,
    inputVal: '',
  },

  getListParams() {
    const {projects, years, selectedYearIndex, selectedProjectIndex, inputVal } = this.data;
    const project = selectedProjectIndex ? projects[selectedProjectIndex] : '';
    const year = selectedYearIndex ? years[selectedYearIndex] : '';
    return {
      project,
      year,
      text: inputVal,
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!this.data.totalCount) this.prepareList(options);
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  prepareList(options){
    wx.showLoading({
      title: '加载中',
      mask: true,
    });
    acceptorApi.list(options).then(acceptors => {
      this.setData({
        acceptors: acceptors.data,
        totalCount: acceptors.totalCount,
      });
      wx.hideLoading();
    });
  },
  bindProjectChange(e) {
    const selectedProjectIndex = parseInt(e.detail.value);
    this.setData({ selectedProjectIndex });
    this.prepareList(this.getListParams());
  },

  bindYearChange(e) {
    const selectedYearIndex = parseInt(e.detail.value);
    this.setData({ selectedYearIndex });
    this.prepareList(this.getListParams());
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.prepareList(this.getListParams());
  },
  clearInput: function () {
    this.setData({
      inputVal: ''
    });
    this.prepareList(this.getListParams());
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });

    // 为避免不断向服务器发送请求，设置2秒的间隔时间，然后再进行查询。
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      this.prepareList(this.getListParams());
    }, 2000);
  },
  addAcceptor() {
    wx.navigateTo({
      url: `/pages/acceptors/edit/edit?name=${this.data.inputVal}`,
    });
  }
});