// pages/list.js
const week = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 天气图标对应表
    weatherIconMap: {
      'sunny': '/images/icon/sunny-icon.png',
      'cloudy': '/images/icon/cloudy-icon.png',
      'overcast': '/images/icon/overcast-icon.png',
      'lightrain': '/images/icon/lightrain-icon.png',
      'heavyrain': '/images/icon/heavyrain-icon.png',
      'snow': '/images/icon/snow-icon.png'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getWeatherFuture(options.city);
    console.log(options)
    this.setData({
      city: options.city
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getWeatherFuture(this.data.city, () => {
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  getWeatherFuture: function(city, callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        city,
        time: new Date().getTime()
      },
      success: res => {
        const result = res.data.result;
        const futureWeather = [];
        let num = 1;
        result.forEach(item => {
          const nowDate = new Date();
          nowDate.setDate(nowDate.getDate() + num);
          num++;
          const date = `${nowDate.getFullYear()}-${nowDate.getMonth() + 1}-${nowDate.getDate()}`;
          futureWeather.push({
            id: item.id,
            minTemp: item.minTemp,
            maxTemp: item.maxTemp,
            weatherIcon: this.data.weatherIconMap[item.weather],
            week: week[nowDate.getDay()],
            date,
          })
        });
        this.setData({
          futureWeather
        })
      },
      complete: () => {
        callback && callback();
      }
    })
  }
})