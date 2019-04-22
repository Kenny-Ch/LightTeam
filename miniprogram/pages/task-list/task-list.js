// pages/detail-task/detal-task.js
const db = wx.cloud.database()
const teamCollection = db.collection('team')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamName:'',
    memberNum:'',
    teamIntroduce:'',
    taskList:[],
    task:[]
  },
  bindMemberList: function () {
    wx.redirectTo({
      url: '/pages/number-list/number-list',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      teamId:options.teamId
    })
    var that = this;
    db.collection('team').where({
      _id: options.teamId 
    }).get({
      success(res) {
       that.setData({
          teamName:res.data[0].name,
          memberNum:res.data[0].userNum,
          teamIntroduce:res.data[0].introduce,
          taskList:res.data[0].taskList
        })
        console.log('【获取指定的team信息】【获取成功】',res.data[0])
        for (var i = 0; i < that.data.taskList.length; i++) {
          db.collection('task').where({
            _id: that.data.taskList[i]
          }).get({
            success(res) {
              that.data.task.push(res.data[0])
              that.setData({
                task: that.data.task
              })
            }
          })
        }
        console.log('【获取指定的task信息】【获取成功】',that.data.task)
      }
    })
    

    showView: (options.showView == "true" ? true : false)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onChangeShowState: function (event) {
    var that = this;
    // var toggleBtnVal = that.data.uhide;
    // var itemId = event.currenTarget.id;
    // if(toggleBtnVal == itemId){

    // }
    that.setData({
      showView: (!that.data.showView)
    })
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
  height: function (e) {
    if (showView) {
      var box = e.target.id;

    }
  }
})