const app = getApp()
const db = wx.cloud.database()
const taskCollection = db.collection('task')
Page({
  data: {
    openId:'',
    userInfo:{},
    taskList:[],
    task:[],
    showView:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                userInfo: res.userInfo//把成功获取的内容存到这个page的data里面
              })
              wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                  this.setData({
                    openId:res.result.openid
                  })
                  console.log("【maintask.js】【已授权】【已获取用户信息】【信息成功存入data中】", this.data.openId,this.data.userInfo)
                },
                fail: err => {
                  console.error('【app.js】【已授权】【获取信息失败】', err)
                }
              })
            }
          })
        }
      }
    })
    var that = this;
    db.collection('user').where({
      openid: that.data.openid
    }).get({
      success(res) {
        that.setData({
          // userId: res.data[0]._id,
          taskList: res.data[0].taskList
        })
        console.log('【maintask.js】【user集合中获取该用户所参与的所有taskid】【获取成功】', that.data.taskList)
        for (var i = 0; i < that.data.taskList.length; i++) {
          db.collection('task').where({
            _id: that.data.taskList[i]
          }).get({
            success(res) {
              that.data.task.push(res.data[0])
              that.data.showView.push(0)
              that.setData({
                task: that.data.task,
                showView:that.data.showView
              })
            }
          })
        }
        console.log('【maintask.js】【通过openid获得用户的所有task】【成功复制至data中task数组中】', that.data.task)
      }
    })
    showView: (options.showView == "true" ? true : false)
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

  height:function(e){
    if(showView)
    {
      var box=e.target.id;
    }
  }
})