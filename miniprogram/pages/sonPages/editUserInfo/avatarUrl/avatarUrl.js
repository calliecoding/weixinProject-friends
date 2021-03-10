// miniprogram/pages/sonPages/editUserInfo/avatarUrl/avatarUrl.js
// miniprogram/pages/sonPages/editUserInfo/avatarUrl/avatarUrl.js
const db = wx.cloud.database()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: ""
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(app.userInfo);
    this.setData({
      avatarUrl: app.userInfo.avatarUrl
    })
  },


  handleUploadImage() { //从本地图册里选择头像，并存在一个临时路径
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      
    }).then((res)=>{
      console.log(res);
      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths[0]
      this.setData({
        avatarUrl : tempFilePaths
      })
    })
  },

  handleButton(){ //上传图片
    wx.showLoading({
      title: '上传中',
    })
    let cloudPath = "userPhoto/" + app.userInfo._openid + Date.now() + ".jpg"
    wx.cloud.uploadFile({
      cloudPath: cloudPath, // 上传至云端的路径
      filePath: this.data.avatarUrl, // 小程序临时文件路径
    }).then(res=>{
      console.log(res);
      // 判断
      let fileID = res.fileID;
      if(fileID){
        db.collection('friends-users').doc(app.userInfo._id).update({
          data:{
            avatarUrl:fileID
          }
        }).then(res=>{
          console.log(1);
          wx.hideLoading();
          wx.showToast({
            title: '上传并更新成功',
          })
          app.userInfo.avatarUrl = fileID; //更新全局的图片
        })
      }
    })

    
   
  },

  bindGetUserInfo(e) {

    let that = this;
    let userInfo = e.detail.userInfo;
    if (userInfo) { //更新
      that.setData({
        userPhoto: app.userInfo.avatarUrl,
        avatarUrl: userInfo.avatarUrl,
      }, () => {
        //在setData的回调函数里更新数据库
        this.updateavatarUrl(userInfo.avatarUrl)
      })
    }
    

  },
  updateavatarUrl(avatarUrl){
    wx.showLoading({
      title: '上传中',
    })
    db.collection('friends-users').doc(app.userInfo._id).update({
      data:{
        avatarUrl:avatarUrl
      }
    }).then(res=>{
      wx.hideLoading();
      wx.showToast({
        title: '上传并更新成功',
      })
      app.userInfo.avatarUrl = avatarUrl; //更新全局的图片
    })
  }
})