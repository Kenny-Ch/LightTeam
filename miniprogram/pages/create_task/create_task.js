const db = wx.cloud.database()
const taskCollection = db.collection('task')
Page({

  /* 页面的初始数据
   */
  data: {
    remind: 0,
    checkbox: [{
        name: "创建任务后马上提醒大家"
      },
      {
        name: "创建任务后马上提醒大家"
      },
      {
        name: "创建任务后马上提醒大家"
      },
    ],
    multiIndex: [0, 0, 0],
    taskid: '',
    taskName: '',
    taskIntroduction: '',
    dateBegin: '请选择开始日期',
    dateEnd: '请选择结束日期',
    timeBegin: '请选择开始时间',
    timeEnd: '请选择结束时间',
    index: 0,
    tag: [' ', '重要且紧急', '不重要且紧急', '重要且不紧急', '不重要且不紧急'],
    tagItem: '全部',
    teamId: '',
    userId: '',
    openId: '',
    taskList: [],
    url: [],
    batchIds: [],
    accept: [],
    unfinishTask: 0,
    formId: '',
    disable:false
  },
  onLoad: function(options) {
    console.log('【create_task】【task-list界面传入参数】', options)
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
        that.setData({
          url: res.data[0].avatarUrl
        })
      }
    })

  },
  onShow: function() {
    var arr = new Array();
    for (var i = 0; i < this.data.batchIds.length; i++) {
      if (i <= 7) {
        if (i == 7) {
          arr.push('');
        } else {
          arr.push(this.data.batchIds[i].Url);
        }
      } else {
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
  bindTaskNameInput: function(e) {
    this.setData({
      taskName: e.detail.value
    })
  },
  bindTaskIntroductionInput: function(e) {
    this.setData({
      taskIntroduction: e.detail.value
    })
  },
  bindMentionTime(e) {
    this.setData({
      remind: e.target.dataset.remind
    })

  },
  bindDateBeginChange(e) {
    this.setData({
      dateBegin: e.detail.value
    })
  },
  bindDateEndChange(e) {
    this.setData({
      dateEnd: e.detail.value
    })
  },
  bindTimeBeginChange(e) {
    this.setData({
      timeBegin: e.detail.value
    })
  },
  bindTimeEndChange(e) {
    this.setData({
      timeEnd: e.detail.value
    })
  },
  bindTagChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindSave: function(event) {
    var date = new Date();
    var currentDate = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes())
    var begin = this.data.dateBegin + this.data.timeBegin;
    var end = this.data.dateEnd + this.data.timeEnd;
    if (!this.data.taskName){
      wx.showToast({
        title: '任务名未填写~',
        icon: 'none',
        duration: 2000
      })
    }
    else if (this.data.dateBegin.length == 7) {
      wx.showToast({
        title: '任务的起始日期未选择~',
        icon: 'none',
        duration: 2000
      })
    }
    else if (this.data.timeBegin.length == 7) {
      wx.showToast({
        title: '任务的起始时间未选择~',
        icon: 'none',
        duration: 2000
      })
    }
    else if (this.data.dateEnd.length == 7 ) {
      wx.showToast({
        title: '任务的结束日期未选择~',
        icon: 'none',
        duration: 2000
      })
    }
    else if (this.data.timeEnd.length == 7) {
      wx.showToast({
        title: '任务的结束时间未选择~',
        icon: 'none',
        duration: 2000
      })
    }
    else if ((this.data.dateBegin + this.data.timeBegin) >= (this.data.dateEnd + this.data.timeEnd)) {
      wx.showToast({
        title: '任务的结束日期时间应当晚于开始日期时间~',
        icon: 'none',
        duration: 2000
      })
    }
    else if (currentDate >= (this.data.dateEnd + this.data.timeEnd)) {
      wx.showToast({
        title: '任务的结束日期时间应当晚于当前日期时间~',
        icon: 'none',
        duration: 2000
      })
    }
    else if (this.data.batchIds.length == 0) {
      wx.showToast({
        title: '任务的参与成员未选择~',
        icon: 'none',
        duration: 2000
      })
    }
    else if (!this.data.taskIntroduction) {
      wx.showToast({
        title: '任务详情未填写~',
        icon: 'none',
        duration: 2000
      })
    }
    else if (this.data.remind == 0) {
      wx.showToast({
        title: '任务的提醒方式还未选择~',
        icon: 'none',
        duration: 2000
      })
    }
 else {
      this.setData({
        formId: event.detail.formId,
        disable: true
      })
      var acceptarr = [];
      var that = this;
      for (var i = 0; i < this.data.batchIds.length; i++) {
        acceptarr.push(false);
      }
      this.setData({
        accept: acceptarr
      })
      taskCollection.add({
        data: {
          "name": this.data.taskName,
          "taskIntroduction": this.data.taskIntroduction,
          "startDate": this.data.dateBegin,
          "endDate": this.data.dateEnd,
          "startTime": this.data.timeBegin,
          "endTime": this.data.timeEnd,
          "accept": this.data.accept,
          "finish": false,
          "tag": this.data.index,
          "userList": this.data.batchIds,
          "team": this.data.teamId,
          "teamName": this.data.teamName,
          "type": 0,
          "tmsgid": ''
        },
        success: res => {
          this.setData({
            taskid: res._id,
            unfinishTask: this.data.unfinishTask
          })
          // db.collection('user').doc(that.data.userId).update({
          //   data: {
          //     taskList: db.command.push(that.data.taskid)
          //   },
          // })
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
              unfinishTask: that.data.unfinishTask + 1
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
                taskListLength: prevPage.data.taskListLength + 220,
                type0: prevPage.data.type0+1,
                typeunfinsh: prevPage.data.typeunfinsh + 220,
                unfinishTask: prevPage.data.unfinishTask + 1,
                de: 0
              })
              //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。
              //最后就是返回上一个页面。
            }
          })
          if (that.data.remind != 3) {
            var time = 0;
            if (that.data.remind == 2)
              time = 86400000;
            else
              time = 3600000;
            var endTime = that.data.dateEnd + ' ' + that.data.timeEnd;
            var endDate = new Date(Date.parse(endTime.replace(/-/g, "/")) - time);
            var end = endDate.getFullYear() + '-' + (endDate.getMonth() + 1 < 10 ? "0" + (endDate.getMonth() + 1) : endDate.getMonth() + 1) + '-' + (endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate()) + ' ' +(endDate.getHours() < 10 ? "0" + endDate.getHours() : endDate.getHours()) + ':' + (endDate.getMinutes() < 10 ? "0" + endDate.getMinutes() : endDate.getMinutes());
            db.collection('templateMsg').add({
              data: {
                openId: [that.data.openId],
                userId: [that.data.userId],
                formId: [that.data.formId],
                leaderId: that.data.userId,
                taskId: res._id,
                teamName: that.data.teamName,
                taskName: that.data.taskName,
                actualEndTime: endTime,
                endTime: end,
                remind: (that.data.remind == 2) ? '1天' : '1小时'
              },
              success(res) {
                console.log(res,'dfdfdf')
                db.collection('task').doc(that.data.taskid).update({
                  data: {
                    tmsgid: res._id
                  },
                  success: console.log,
                  fail: console.error
                })
              },
              fail: console.error
            })
          }
          console.log('【create_task】【添加任务信息】【成功添加任务信息】', res)
          wx.navigateBack({
            delta: 1 // 返回上一级页面。
          })
        }
      })
    }
  },
  bindChooseMember: function() {
    wx.navigateTo({
      url: '/pages/choosemember/choosemember?teamId=' + this.data.teamId + '&userId=' + this.data.userId + '&openId=' + this.data.openId
    })
  }
})