// miniprogram/pages/sonPages/editUserInfo/nickName/nickName.js
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: ""
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(app.userInfo);
    this.setData({
      nickName: app.userInfo.nickName
    })
  },

  handleText(ev) { //获取用户输入内容，并设置到data里
    let value = ev.detail.value;
    this.setData({
      nickName: value
    })
  },
  handleButton() { //提交数据库
    this.updateNickName()
  },
  updateNickName() { //提交数据库
    wx.showLoading({
      title: '更新中',
    })
    db.collection('friends-users').doc(app.userInfo._id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        nickName: this.data.nickName
      }
    }).then((res) => {
      wx.hideLoading()
      console.log(res)
      wx.showToast({
        title: "更新成功"
      })
      app.userInfo.nickName = this.data.nickName
    })
  },
  bindGetUserInfo(e) {
    let that = this;
    let userInfo = e.detail.userInfo;
    if (userInfo) { //更新

      that.setData({
        userPhoto: app.userInfo.avatarUrl,
        nickName: userInfo.nickName,
      }, () => {
        //在setData的回调函数里更新数据库
        this.updateNickName()
      })
    }

  },
})