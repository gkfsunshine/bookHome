// pages/my/index.js
Page({
 
  

  /**
   * 页面的初始数据
   */
  data: {

  },

  navigateToOrderList(){
    wx.navigateTo({
      url: '/pages/order/list/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      // 检查用户登录状态
    const token = wx.getStorageSync('token'); // 假设 token 存储在本地
    if (!token) {
      // 如果未登录，跳转到登录页面
      // wx.redirectTo({
      //   url: '/pages/login/index' // 登录页面路径
      // });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})