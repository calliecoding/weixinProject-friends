// components/callPhone/copyText/copyText.js
Component({
  options: {
    styleIsolation: 'apply-shared'
  },
  /**
   * 组件的属性列表
   */
  properties: {
    copyText:String
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleCopyText(){
      wx.setClipboardData({
        data: this.data.copyText,
        success (res) {
          wx.showToast({
            title: '复制成功',
          })
        }
      })
  }
}
})
