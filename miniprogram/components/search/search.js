// components/search/search.js
const app = getApp();
const db = wx.cloud.database()
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isFocus:false,//是否有光标
    searchHistory:[],//历史记录
    searchList:[],//搜索用户列表
    value:'',//搜索框默认值
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus(){ //获取光标时的操作
      this.setData({
        isFocus:true
      });
      wx.getStorage({ //获取本地存储
        key: 'searchHistory',
        success :(res) =>{
          this.setData({
            searchHistory:res.data
          })
        }
      })
    },
    handleCancle(){ //点击取消时的操作
      this.setData({
        isFocus:false,
        value:""
      })
    },
    handleConfirm(ev){ //回车时，搜索
      // console.log(ev);
      let keyword = ev.detail.value;
      let cloneHistory = [...this.data.searchHistory];
      cloneHistory.unshift(ev.detail.value)
      wx.setStorage({
        key:"searchHistory",
        data:[...new Set(cloneHistory)], //去重
      });
      this.changeSearchList(keyword)
    
    },
    handleDeleteHistory(){//删除历史记录
      wx.removeStorage({
        key: 'searchHistory',
        success: (res)=> {
         this.setData({
          searchHistory:[]
         })
        }
      })
    },
    changeSearchList(keyword){//查询数据库
      console.log(keyword);
      db.collection('friends-users').where({
        nickName: db.RegExp({
          regexp: keyword,
          options: 'i',
        })
      }).field({
        avatarUrl:true,
        nickName:true
      }).get().then(res=>{
        console.log(res.data);
        this.setData({
          searchList:res.data
        })
      })
    },
    handleHistoryItem(ev){//点击历史记录的词，进行搜索
      let value = ev.target.dataset.text;
      // console.log(value);
      this.changeSearchList(value);
      this.setData({
        value
      })
    }
  }
})
