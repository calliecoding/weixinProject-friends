// miniprogram/pages/sonPages/editUserInfo/phone/phone.js
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:""
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(app.userInfo);
    this.setData({
      phone:app.userInfo.phone
    })
  },

  handleText(ev){ //获取用户输入内容，并设置到data里
    let value = ev.detail.value;
    this.setData({
      phone:value
    })
  },
  handleButton(){ //提交数据库
    this.updatePhone()
  },
  updatePhone(){ //提交数据库
    wx.showLoading({
      title: '更新中',
    })
    console.log(app.userInfo._id);
    db.collection('friends-users').doc(app.userInfo._id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        phone:this.data.phone
      }
    }).then((res)=>{
        wx.hideLoading()
        wx.showToast({
          title:"更新成功"
        })
        app.userInfo.phone = this.data.phone
    })
  }

})