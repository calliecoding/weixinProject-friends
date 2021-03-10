// miniprogram/pages/sonPages/editUserInfo/signature/signature.js
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    signature:""
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(app.userInfo);
    this.setData({
      signature:app.userInfo.signature
    })
  },

  handleText(ev){ //获取用户输入内容，并设置到data里
    let value = ev.detail.value;
    this.setData({
      signature:value
    })
  },
  handleButton(){ //提交数据库
    this.updateSignature()
  },
  updateSignature(){ //提交数据库
    wx.showLoading({
      title: '更新中',
    })
    db.collection('friends-users').doc(app.userInfo._id).update({
      // data 传入需要局部更新的数据
      data: {
        // 表示将 done 字段置为 true
        signature:this.data.signature
      }
    }).then((res)=>{
        wx.hideLoading()
        console.log(res)
        wx.showToast({
          title:"更新成功"
        })
        app.userInfo.signature = this.data.signature
    })
  }

})
