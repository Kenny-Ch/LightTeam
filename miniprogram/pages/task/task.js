const db = wx.cloud.database()
const taskCollection = db.collection('task')
const teamCollection = db.collection('team')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamName:'icode',
    taskName:'task',
    memberImgList: [],
    dateBegin: '',
    dateEnd: '',
    timeBegin: '',
    timeEnd: '',
    finish:true,
    tagNum:10,
    tag:['重要且紧急','不重要且不紧急','重要且不紧急','不重要且不紧急'],
    userList:[],
    buttonHidden: true
  },
  haveReceive(e){
    this.setData({
      buttonHidden:false
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.teamId)
    taskCollection.doc(options.taskId)
    .get({
      success:res=>  {
        console.log('【获取指定用户task信息】【获取成功】',res.data),
        this.setData({
          taskName:res.data.name,
          dateBegin:res.data.startDate,
          dateEnd: res.data.endDate,
          timeBegin: res.data.startTime,
          timeEnd: res.data.endTime,
          finish:res.data.finish,
          tagNum:res.data.tag,
          memberImgList:res.data.userList
        })
      }
    }),
    teamCollection.doc(options.teamId)
      .get({
        success: res => {
          console.log('【获取指定用户team信息】【获取成功】', res.data),
            this.setData({
              teamName: res.data.name
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

  }
})