Component({
  /**
   * 组件的属性列表
   */
  properties: {
    forecast:{
      type:Array,
      value: [{
        id: 0,
        time: 13,
        temp: 12,
        weather: 'sunny'
      }]
    }
  },

  /**
   * 组件的初始数据
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
   * 组件的方法列表
   */
  methods: {

  }
})