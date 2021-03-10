// miniprogram/pages/near/near.js
const db = wx.cloud.database();
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '', //经纬度
    latitude: '',
    scale: "16",
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLocation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getLocation()
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getLocation() { //获取经纬度
    wx.getLocation({
      type: 'gcj02 ',
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        this.setData({
          latitude,
          longitude
        })
        this.getNearUser()
      }
    })
  },
  getNearUser() { //获取附近用户
    db.collection('friends-users').where({
      location: _.geoNear({
        geometry: db.Geo.Point(this.data.longitude, this.data.latitude),
        minDistance: 0,
        maxDistance: 5000,
      }),
      isLocation: true, //开启地理位置
    }).field({
      latitude: true,
      longitude: true,
      avatarUrl: true,
    }).get().then(res => {
      console.log(res.data);
      let data = res.data;
      let result = [];

      if (data.length) {
        data.forEach((item, index) => {
          if (item.avatarUrl.includes("cloud://")) { //判断是否是图片路径还是fileId
            wx.cloud.getTempFileURL({//异步换取临时链接
              fileList: [item.avatarUrl],
            })
              .then(res => {
                console.log(res.fileList[0].tempFileURL);
                result.push({
                  id: index,
                  latitude: item.latitude,
                  longitude: item.longitude,
                  iconPath: res.fileList[0].tempFileURL,
                  width: 50,
                  height: 50,
                  userId:item._id
                })
                this.setData({
                  markers: result
                })
              })
          } else {
            result.push({
              id: index,
              latitude: item.latitude,
              longitude: item.longitude,
              iconPath: item.avatarUrl,
              width: 50,
              height: 50,
              userId:item._id
            })
            this.setData({
              markers: result
            })
          }
        })
      }
    })
  },
  markertap(ev){ //点击图标，触发事件函数
   let  {markerId} = ev.detail 

   let userId = this.data.markers[markerId].userId
   wx.navigateTo({
     url: '/pages/detail/detail?userId='+userId,
   })
   
  }
})