const app = getApp()
const db = wx.cloud.database()
const taskCollection = db.collection('task')
Page({
  data: {
    openId: '',
    userId:'',
    userInfo: {},
    taskList: [],
    task: [],
    leaderId:'',
    de: 0,
    unfinshtasks:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onPullDownRefresh: function () {
    this.setData({
      openId: '',
      userId: '',
      userInfo: {},
      taskList: [],
      task: [],
      leaderId: '',
      de: 0,
      unfinshtasks: 0
    })
    this.onLoad();
  },
  onLoad: function(options) {
    wx.stopPullDownRefresh()
    var that = this;
    var count = 0;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.setData({
                userInfo: res.userInfo //把成功获取的内容存到这个page的data里面
              })
              wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                  this.setData({
                    openId: res.result.openid
                  })
                  console.log("【maintask】【已授权】【已获取用户信息】【信息成功存入data中】", this.data.openId, this.data.userInfo)
                  
                  db.collection('user').where({
                    _openid: that.data.openId
                  }).get({
                    success(res) {
                      that.setData({
                        userId: res.data[0]._id,
                        taskList: res.data[0].taskList
                      })
                      console.log('【maintask】【user集合中获取该用户所参与的所有taskid】【获取成功】', that.data.taskList)  
                       if(res.data[0].taskList.length==0){
                        that.setData({
                          de:1
                        })
                       }
                        else{
                          that.setData({
                            de:0
                          })
                        }
                        var ttask = new Array();
                      for (var i = that.data.taskList.length - 1; i >= 0; i--) {
                        var c = 0;
                        db.collection('task').where({
                          _id: that.data.taskList[i]
                        }).get({
                          success(res) {
                            ttask.push(res.data[0])
                            ttask[count].show = false
                            if(!res.data[0].finish)
                              that.data.unfinshtasks=that.data.unfinshtasks+1
                            if (res.data[0].type == 1) {
                              for (var j = 0; j < res.data[0].accept.length; j++) {
                                if (that.data.userId == res.data[0].userList[j].id) {
                                  that.data.unfinshtasks = that.data.unfinshtasks + res.data[0].accept[j]?-1:0
                                  ttask[count].finish = res.data[0].accept[j]
                                }
                              }
                            }
                            that.setData({
                              task: ttask,
                              unfinshtasks:that.data.unfinshtasks
                            })
                            if (res.data[0].type == 0) {
                              var taskstart = "task[" + c + "].startDate"
                              var taskend = "task[" + c + "].endDate"
                              that.setData({
                                [taskstart]: that.data.task[c].startDate.substring(5, 10) + ' ',
                                [taskend]: ' to ' + that.data.task[c].endDate.substring(5, 10) + ' ',
                              })
                            }
                            count++
                            c++
                          }
                        })
                          
                      }
                      var count = 0;
                      for (var i = 0; i < that.data.task.length; i++) {
                        console.log(count)
                        db.collection('team').where({
                          _id: that.data.task[count].team
                        }).get({
                          success(res) {
                            console.log(res)
                            that.data.task[count].team = res.data.name
                            that.data.task[count].leaderId = res.data.leader
                            that.setData({
                              task: that.data.task,
                            })
                            count++
                          }
                        })
                      }
                      console.log('【maintask】【通过openid获得用户的所有task】【成功复制至data中task数组中】', that.data.task)
                     
                    }
                  })
                },
                fail: err => {
                  console.error('【maintask】【已授权】【获取信息失败】', err)
                }
              })
            }
          })
        }
      }
    })

  },

  deleteTask: function(e) {
    var that = this;
    var task = that.data.tsak;
    var taskList = that.data.taskList;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此任务吗？',
      success: function(res) {
        if (res.confirm) {
          console.log('【maintask】【触发长按删除事件】【点击确定删除】');
          that.data.task.splice(index, 1);
          that.data.taskList.splice(index, 1)
        } else if (res.cancel) {
          console.log('【maintask】【触发长按删除事件】【点击取消】');
          return false;
        }
        that.setData({
          task: that.data.task,
          taskList: that.data.taskList
        });
      }
    })
  },
  bindDetail:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var teamNameIndex = that.data.task[index].teamName ;
    var taskIdIndex = that.data.task[index]._id;
    var leaderIdIndex = that.data.task[index].leaderId
    wx.navigateTo({
      url: "/pages/task/task?&teamName=" + teamNameIndex+
      "&taskId="+taskIdIndex+
      "&userId="+ that.data.userId +
      "&leaderId="+ leaderIdIndex +
      "&openId=" + that.data.openId
    })
  },
  onChangeShowState: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    console.log()
    that.data.task[index].show = !that.data.task[index].show
    that.setData({
      task: that.data.task
    })
  },
onChangeDetail: function(e){
  var that = this;
  var index = e.currentTarget.dataset.index;
  var teamNameIndex = that.data.task[index].teamName;
  var taskIdIndex = that.data.task[index]._id;
  var leaderIdIndex = that.data.task[index].leaderId
  wx.navigateTo({
    url: "/pages/inform/inform?&teamName=" + teamNameIndex +
      "&taskId=" + taskIdIndex +
      "&userId=" + that.data.userId +
      "&leaderId=" + leaderIdIndex
  })
}
})
