// miniprogram/pages/index/index.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
      "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg",
      "https://res.wx.qq.com/wxdoc/dist/assets/img/0.4cb08bb4.jpg"
    ],
    dataList: [],
    current:"links", //记录当前列表的排序类型：按照links/time
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
    this.getDataList()
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
  handleLinks(ev) {

    let _id = ev.target.dataset.id;
    wx.cloud.callFunction({
      name: "updateLinks",
      data: {
        collection: 'friends-users',
        doc: _id,//要点赞的用户id
       
        data: "{ links:_.inc(1) }", //要操作的字段
      }
    }).then(res => {
      let updated = res.result.stats.updated
      if(updated){
        let cloneListData = [...this.data.dataList];//克隆一份新数组
        cloneListData.forEach((item)=>{
          if(item._id ==  _id){
            item.links ++;
          }
        })
        this.setData({
          dataList:cloneListData
        })
      }
    })
  },
  handleCurrent(ev){ //选项卡的切换效果
    let current = ev.target.dataset.current;
    if(current === this.data.current)return; //显示内容符合选项卡时，不做操作
    this.setData({
      current:current
    });
    this.getDataList()

  },
  getDataList(){ //数据库的查询操作
    db.collection('friends-users').field({
      avatarUrl: true,
      links: true,
      nickName: true,
    }).orderBy(this.data.current,'desc').get().then(res => {
      console.log(res.data);
      this.setData({
        dataList: res.data
      })
    })
  },
  handleToDetail(ev){ //进入详情页面
    let id = ev.target.dataset.id;
    wx.navigateTo({
      url:"/pages/detail/detail?userId=" + id
    })
  }
})