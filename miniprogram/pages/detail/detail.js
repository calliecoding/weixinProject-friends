// miniprogram/pages/detail/detail.js
const db = wx.cloud.database();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail: {},
    isFriend: false, //判断好友关系
    isHidden: false, //自己访问自己的时候，隐藏添加好友的按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let userId = options.userId;

    //数据库查询操作
    db.collection('friends-users').doc(userId).get().then((res) => {
      console.log(res);
      this.setData({
        detail: res.data
      })
      let friendList = res.data.friendList;
      console.log(friendList);
      console.log(app.userInfo._id);
      if(friendList.includes(app.userInfo._id)){//判断是否是好友关系
        this.setData({
          isFriend: true
        })

      }else{ //不是好友关系
        this.setData({
          isFriend: false
        },()=>{
          console.log(1);
          if(userId == app.userInfo._id){ //判断是不是自己 
            this.setData({
              isFriend: true,
              isHidden:true
            })
          }
        })

      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
  handleAddFriend() {//发起好友申请

    if (app.userInfo._id) { //判断用户是否登陆
      //
      db.collection('friends-message').where({ //查询好友申请列表
        userId:this.data.detail._id
      }).get().then(res=>{
        if(res.data.length){//判断数据库中是否存在数据，存在就更新好友申请的数据
          if(res.data[0].list.includes(app.userInfo._id)){ //判断是否已经申请过
            wx.showToast({
              title: '已申请过！',
            })
          }else{
            //在服务端进行批量更新
            wx.cloud.callFunction({
              name:'updateLinks',
              data:{
                collection:'friends-message',
                where:{ 
                  userId :this.data.detail._id,
                },
                data:`{list: _.unshift("${app.userInfo._id}")}`
              }
            }).then(res=>{
              wx.showToast({
                title: '申请成功～',
              })
            })
          }

        }else{ //添加好友申请的数据
          db.collection('friends-message').add({
            data:{
              userId :this.data.detail._id,
              list:[app.userInfo._id]
            }
          }).then((res)=>{
            wx.showToast({
              title: '已发送好友申请',
            })
          })

        }
      })


    } else {
      wx.showToast({
        title: '请先登陆',
        duration: 2000,
        icon: "none",
        success() {
          //跳转到user页面
          setTimeout(() => {
            wx.switchTab({
              url: "/pages/user/user"
            })
          }, 2000)
        }
      })
    }
  }
})