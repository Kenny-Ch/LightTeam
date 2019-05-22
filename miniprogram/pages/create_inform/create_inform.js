const db = wx.cloud.database()
const taskCollection = db.collection('task')
Page({

  /* 页面的初始数据
   */
  data: {
    remind: 0,
    multiIndex: [0, 0, 0],
    taskid: '',
    taskName: '',
    taskIntroduction: '',
    index: 0,
    teamId: '',
    userId: '',
    taskList: [],
    url: [],
    batchIds: [],
    accept: [],
    unfinishTask: 0
  },
  onLoad: function (options) {
    console.log('【create_form】【task-list界面传入参数】', options)
    this.setData({
      teamId: options.teamId,
      openId: options.openId,
      userId: options.userId,
      teamName: options.teamName,
      unfinishTask: parseInt(options.unfinishTask)
    })
    var that = this;
    db.collection('user').where({
      _id: that.data.userId
    }).get({
      success(res) {
        // that.setData({
        //   url0: res.data[0].avatarUrl
        // })
      }
    })

  },
  onShow: function () {
    var arr = new Array();
    for (var i = 0; i < this.data.batchIds.length; i++) {
      if (i <= 7) {
        if (i == 7) {
          arr.push('');
        }
        else {
          arr.push(this.data.batchIds[i].Url);
        }
      }
      else {
        arr.push('');
      }
    }
    // try {
    //   wx.setStorageSync('batchIds', this.data.batchIds)
    // } catch (e) {
    // }
    this.setData({
      url: arr
    })
  },
  bindTaskNameInput: function (e) {
    this.setData({
      taskName: e.detail.value
    })
  },
  bindTaskIntroductionInput: function (e) {
    this.setData({
      taskIntroduction: e.detail.value
    })
},
  bindSave: function (event) {
    if (!this.data.taskName ||
      !this.data.taskIntroduction ||
      (this.data.batchIds.length == 0)) {
      console.log('【create_form】【创建通知信息输入情况】【输入不完整】', event)
      wx.showToast({
        title: '通知的信息填写有误或不完整',
        icon: 'none',
        duration: 2000
      })
    } else {
      var acceptarr = [];
      var that = this;
      for (var i = 0; i < this.data.batchIds.length; i++) {
        console.log(i)
        acceptarr.push(false);
      }
      this.setData({
        accept: acceptarr
      })
      taskCollection.add({
        data: {
          "name": this.data.taskName,
          "taskIntroduction": this.data.taskIntroduction,
          "accept": this.data.accept,
          "finish": false,
          "userList": this.data.batchIds,
          "team": this.data.teamId,
          "teamName": this.data.teamName,
          "type": 1
        },
        success: res => {
          this.setData({
            taskid: res._id,
            unfinishTask: this.data.unfinishTask
          })
          var ii = 0;
          for (; ii < that.data.batchIds.length; ii++) {
            wx.cloud.callFunction({
              name: 'pushTaskId',
              data: {
                userId: that.data.batchIds[ii].id,
                taskId: res._id
              },
            })
          }
          db.collection('team').doc(that.data.teamId).update({
            data: {
              taskList: db.command.push(that.data.taskid),
              // unfinishTask: that.data.unfinishTask + 1
            },
          })
          let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
          let prevPage = pages[pages.length - 2]; //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
          db.collection('task').where({
            _id: res._id
          }).get({
            success(res) {
              prevPage.data.task.unshift(res.data[0])
              prevPage.setData({
                task: prevPage.data.task,
                taskListLength: prevPage.data.taskListLength + 130,
                type1: prevPage.data.type1 + 1,
                typeunfinsh: prevPage.data.typeunfinsh + 130,
                // unfinishTask: prevPage.data.unfinishTask + 1,
                de: 0
              })
              //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。
              //最后就是返回上一个页面。
              wx.navigateBack({
                delta: 1 // 返回上一级页面。
              })
            }
          })
          console.log('【create_task】【添加任务信息】【成功添加任务信息】', res)
        }
      })
    }
  },
  bindChooseMember: function () {
    wx.navigateTo({
      url: '/pages/choosemember/choosemember?teamId=' + this.data.teamId + '&userId=' + this.data.userId + '&openId=' + this.data.openId
    })
  }
})