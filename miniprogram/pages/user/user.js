// miniprogram/pages/user/user.js
const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhoto: "/images/user/user-unlogin.png",
    nickName: '你的名字',
    logged: false,
    disabled: true,
    id:'',
    latitude:'',
    longitude:''

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getLocation()
    let that = this;
    wx.cloud.callFunction({  //自动登陆
      name: 'login',
      data: {}
    }).then((res) => {
      // console.log(res.result.openid);
      db.collection('friends-users').where({
        _openid: res.result.openid,
      }).get().then(res => {
        // res.data 包含该记录的数据
        // console.log( res.data);
        //把用户数据写入到全局

        if (!res.data.length) {//数据库里没有用户数据时,通过按钮获取用户数据
          console.log(1);
          that.setData({
            disabled: false
          })
          return
        }
        app.userInfo = Object.assign(app.userInfo, res.data[0])
        that.setData({
          userPhoto: app.userInfo.avatarUrl,
          nickName: app.userInfo.nickName,
          logged: true,
          id:app.userInfo._id
        })
        that.getMessage()
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (!app.userInfo) return
    if (this.data.nickName !== app.userInfo.nickNames) {
      this.setData({
        nickName: app.userInfo.nickName,
        id:app.userInfo._id
      })
    }
    if (this.data.userPhoto !== app.userInfo.avatarUrl) {
      this.setData({
        userPhoto: app.userInfo.avatarUrl,
        id:app.userInfo._id
      })
    }

  },
  bindGetUserInfo(e) {
    let that = this;
    let userInfo = e.detail.userInfo;
    if (!this.data.logged && userInfo) {
      //创建表
      db.collection('friends-users').add({
        // data 字段表示需新增的 JSON 数据
        data: {
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl,
          signature: "",
          phone: "",
          weixin: "",
          links: 0,
          time: new Date(),
          isLocation: true,
          friendList:[],
          longitude:this.data.longitude, //经纬度
          latitude:this.data.latitude,
          location: db.Geo.Point(this.data.longitude, this.data.latitude), //geo
        },
        success: function (res) {
          // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id

          db.collection('friends-users').doc(res._id).get().then(res => {
            // res.data 包含该记录的数据

            //把用户数据写入到全局
            app.userInfo = Object.assign(app.userInfo, res.data)
            that.setData({
              userPhoto: app.userInfo.avatarUrl,
              nickName: app.userInfo.nickName,
              logged: true,
              id:app.userInfo._id
            })
          })

        }
      })
    }

  },
  getMessage() {
    db.collection('friends-message')  //监听数据变化
      .where({
        userId: app.userInfo._id
      })
      .watch({
        onChange: function (snapshot) {
          console.log(snapshot);
          if(snapshot.docChanges.length){
            let list = snapshot.docChanges[0].doc.list; //获取申请列表

            if(list.length){
              wx.showTabBarRedDot({ //添加红点
                index:2
              })
              app.userMessage = list
            }else{
              wx.hideTabBarRedDot({
                index:2
              })
              app.userMessage = []
            }
          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
    
  },
  getLocation(){ //获取经纬度
    wx.getLocation({
      type: 'gcj02 ',
      success :(res)=>{
        const latitude = res.latitude
        const longitude = res.longitude
        this.setData({
          latitude,
          longitude
        })
      }
    })
  }

})