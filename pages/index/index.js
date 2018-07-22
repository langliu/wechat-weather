// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

// 天气中英对照
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

// 导航栏背景颜色对应表
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

Page({
  data: {
    temp: '',
    weather: '',
    background_image: '',
    forecast: [],
    city: '北京市',
    locationAuthType: UNPROMPTED,
  },
  onLoad: function() {
    wx.getSetting({
      success: (res) => {
        const auth = res.authSetting['scope.userLocation'];
        this.setData({
          locationAuthType: auth ? AUTHORIZED : (auth === false) ? UNAUTHORIZED : UNPROMPTED,
        });
        if (auth) {
          this.getLocation()
        } else {
          this.getWeather()
        }
      }
    })
    this.getWeather(this.data.city);
    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'FCBBZ-XKLCW-RD3RN-RSDAV-WALNQ-IFBPO'
    });
  },
  onPullDownRefresh: function() {
    this.getWeather(this.city, () => {
      wx.stopPullDownRefresh();
    });
  },
  getWeather: function(city = '北京市', callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city
      },
      success: (res) => {
        const result = res.data.result;
        const nowWeather = result.now;
        this.setForecast(result);
        this.setTodayTemp(result);
        this.setData({
          temp: nowWeather.temp,
          weather: weatherMap[nowWeather.weather],
          background_image: `/images/background/${nowWeather.weather}-bg.png`,
        });
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: weatherColorMap[nowWeather.weather],
        })
      },
      complete: () => {
        callback && callback();
      }
    });
  },
  setForecast: function(result) {
    const forecast = [];
    let nowHour = new Date().getHours();
    result.forecast.forEach(item => {
      forecast.push({
        weather: item.weather,
        temp: item.temp,
        time: `${nowHour % 24}时`
      });
      nowHour += 3;
    });
    forecast[0].time = '现在';
    this.setData({
      forecast
    });
  },
  setTodayTemp: function(result) {
    const nowDate = new Date();
    const today = `${nowDate.getFullYear()}-${nowDate.getMonth()+1}-${nowDate.getDate()} 今天`
    this.setData({
      minTemp: result.today.minTemp,
      maxTemp: result.today.maxTemp,
      today
    })
  },
  onTapDayWeather: function() {
    wx.navigateTo({
      url: `/pages/list/list?city=${this.data.city}`,
    })
  },
  onTapLocation: function() {
    this.getLocation();

    wx.getSetting({
      success: (res) => {
        const auth = res.authSetting['scope.userLocation'];
        console.log(res.authSetting)
        if (auth) {
          this.setData({
            locationAuthType: AUTHORIZED
          })
        } else if (auth === false) {
          this.setData({
            locationAuthType: UNAUTHORIZED
          })

        }
      }
    })
  },
  getLocation: function() {
    wx.getLocation({
      success: (res) => {
        qqmapsdk.reverseGeocoder({
          locatoon: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            const city = res.result.address_component.city;
            this.setData({
              city,
            });
            this.getWeather(city);
          }
        });
      },
      fail: () => {
        this.setData({
          locationAuthType: UNAUTHORIZED,
        })
      }
    })
  }
})