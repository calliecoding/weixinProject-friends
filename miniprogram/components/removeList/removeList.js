// components/removeList/removeList.js
const app = getApp();
const db = wx.cloud.database()
const _ = db.command

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    messageId:String, //接收到_id值，用于查询数据库
  },

  /**
   * 组件的初始数据
   */
  data: { 
    userMessage:{}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDeleteMsg(){ //删除用户申请
      let that = this;
      wx.showModal({
        title: '提示',
        content: '是否删除该申请',
        success (res) {
          if (res.confirm) {//用户点击确定时，删除申请
            that.removeMessage()
            
          } else if (res.cancel) {//用户点击取消
           
          }
        }
      })
      

    },
    handleAddFriend(){ //同意好友申请
      let that = this;
      wx.showModal({
        title: '提示',
        content: '是否同意该好友申请',
        confirmText:'同意',
        success (res) {
          if (res.confirm) {//用户点击确定
            //数据库操作
            db.collection('friends-users').doc(app.userInfo._id).update({
              data:{
                friendList: _.unshift(that.data.messageId)
              }

            }).then(res=>{
              console.log(res);
              wx.cloud.callFunction({ //在对方的好友列表里面，添加friendList
                name:'updateLinks',
                data:{
                  collection:'friends-users',
                  doc:that.data.messageId,
                  data:`{friendList:_.unshift('${app.userInfo._id}')}`
                }
              }).then(()=>{
                that.removeMessage()
              })
            })
          } else if (res.cancel) {//用户点击取消
           
          }
        }
      })
    },
    removeMessage(){
      let that = this
      //数据库操作
      db.collection('friends-message').where({
        userId: app.userInfo._id
      }).get().then(res=>{
        
        let list = res.data[0].list;
        console.log(list);
        list =list.filter((val,i)=>{
          return val != that.data.messageId
        })

        //更新数据库
        wx.cloud.callFunction({
          name:'updateLinks',
          data:{
            collection:'friends-message',
            where:{
              userId: app.userInfo._id
            },
            data:{
              list 
            }
          }
        }).then(res=>{
          that.triggerEvent('myevent', list )
        })
      })
    }
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      db.collection('friends-users').doc(this.data.messageId).field({
        avatarUrl: true,
        nickName:true
      }).get().then(res=>{
        console.log(res.data);
        this.setData({
          userMessage: res.data
        })
      })

    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

})

