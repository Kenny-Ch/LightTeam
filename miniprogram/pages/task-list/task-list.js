// pages/detail-task/detal-task.js
const db = wx.cloud.database()
const teamCollection = db.collection('team')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showToolbar: false,
    boxStyle: 'box_b',
    up: true,
    down: false,
    teamName: '',
    memberNum: '',
    teamIntroduce: '',
    openId: '',
    teamId: '',
    userId: '',
    leaderId: '',
    taskList: [],
    task: [],
    userList: [],
    type: '',
    uhide: 0,
    currentTab: '',
    hiddenButton: true,
    taskListLength: 1,
    taskListLength2: 1,
    typeunfinish: 0,
    actualLength:1,
    boxcolor: ["rgba(210, 210, 210, 1)", "#fc2100", "#fff659", "#27e530", "#5a97f6","#fff"],
    de: 0,
    nu: 0,
    type0: 0,
    type1: 0,
    finished: false,
    ii:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onPullDownRefresh: function () {
    var teamId= this.data.teamId;
    var openId= this.data.openId;
    var userId= this.data.userId;
    // wx.showNavigationBarLoading() //在标题栏中显示加载
    //模拟加载
    this.setData({
      showToolbar: false,
      boxStyle: 'box_b',
      up: true,
      down: false,
      teamName: '',
      memberNum: '',
      teamIntroduce: '',
      leaderId: '',
      taskList: [],
      task: [],
      userList: [],
      type: '',
      uhide: 0,
      hiddenButton: true,
      taskListLength: 1,
      taskListLength2: 1,
      typeunfinish: 0,
      actualLength: 1,
      de: 0,
      nu: 0,
      type0: 0,
      type1: 0,
      finished: false,
      ii: 0
    })
    this.onLoad({
      teamId: teamId,
      openId: openId,
      userId: userId
    });
    // setTimeout(function () {
    //   // complete
    //   // wx.hideNavigationBarLoading() //完成停止加载


    //    //停止下拉刷新
    // }, 1000);
  },
  onLoad: function(options) {
    wx.stopPullDownRefresh()
    console.log('【task-list】【index界面传入参数】', options)
    this.setData({
      teamId: options.teamId,
      openId: options.openId,
      userId: options.userId
    })
    var that = this;
    db.collection('team').where({
      _id: options.teamId
    }).get({
      success(res) {
        that.setData({
          teamName: res.data[0].name,
          memberNum: res.data[0].userNum,
          teamIntroduce: res.data[0].introduce,
          taskList: res.data[0].taskList,
          userList: res.data[0].userList,
          taskListLength: 0,
          // taskListLength: (res.data[0].taskList.length) * 185 + 500,
          taskListLength2: (res.data[0].userList.length) * 70 + 500,
          unfinishTask: res.data[0].unfinishTask,
          leaderId: res.data[0].leader
        })
        console.log('【task-list】【获取指定的team信息】【获取成功】', res.data[0])
        if (that.data.taskList.length == 0) {
          that.setData({
            de: 1
          })
        }
        if (that.data.userList.length == 0) {
          that.setData({
            nu: 1
          })
        }
        if (that.data.leaderId == that.data.userId) {
          that.setData({
            hiddenButton: false
          })
        }
        var ttask = new Array();
        for (let i = that.data.taskList.length-1; i >= 0 ; i--) {
          db.collection('task').where({
            _id: that.data.taskList[i]
          }).get({
            success(res) {
              ttask.push(res.data[0])
              if(res.data[0].type==0){
                that.data.type0++;
              }  
              else{
                that.data.type1++;
                for(var j=0;j<res.data[0].accept.length;j++){
                  if(that.data.userId==res.data[0].userList[j].id){
                    ttask[that.data.ii].finish=res.data[0].accept[j]
                  }
                  
                }
              }
              if(!res.data[0].finish){
                if(res.data[0].type==0){
                  that.data.typeunfinish = that.data.typeunfinish + 220
                }
                else{
                  that.data.typeunfinish = that.data.typeunfinish + 130
                }
              }
              that.setData({
                task: ttask,
                type0: that.data.type0,
                type1: that.data.type1,
                taskListLength: that.data.typeunfinish,
                typeunfinish: that.data.typeunfinish,
                ii:that.data.ii+1
              })
            }
          })
        }
        console.log('【task-list】【获取指定的task信息】【获取成功】', that.data.task)
      }
    })

  },
  /*** 滑动切换tab***/
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    })
  },
  /*** 点击tab切换***/
  swichNav: function(e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current
    })
  },
  // bindMemberList: function() {
  //   wx.redirectTo({
  //     url: '/pages/number-list/number-list',
  //   })
  // },
  longPressDelete: function(e) {
    var that = this;
    var task = that.data.task;
    var taskList = that.data.taskList;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    var taskIndexId = that.data.taskList[that.data.taskList.length-1-index];
    var finish = that.data.task[index].finish;
    var type = that.data.task[index].type;
    if (this.data.userId == this.data.leaderId) {
      wx.showModal({
        title: '提示',
        content: '确定要删除此任务吗？',
        success: function(res) {   
          if (res.confirm) {
            console.log('【task-list】【长按删除】【点击确定】', '索引为：', index, taskIndexId);
            db.collection('task').doc(taskIndexId).remove({
              success: console.log,
              fail: console.error
            })
            wx.cloud.callFunction({
              name: 'deleteTaskId',
              data: {
                taskId: task[index]._id,
                userList: task[index].userList
              },
            })
            if (task[index].type == 1) {
              if(task[index].finish == false){
                that.data.typeunfinish = that.data.typeunfinish - 130
              }
              that.setData({
                typeunfinish: that.data.typeunfinish,
                type1: that.data.type1 - 1
              })
            }
            else {
              if (task[index].finish == false) {
                that.data.typeunfinish = that.data.typeunfinish - 220
              }
              that.setData({
                typeunfinish: that.data.typeunfinish,
                type0: that.data.type0 - 1
              })
            }
            task.splice(index, 1);
            taskList.splice(that.data.taskList.length-1-index, 1);
            that.setData({
              taskListLength: that.data.taskListLength - 220,
              typeunfinish: that.data.typeunfinish - 220,
              type1: that.data.type1,
              type0: that.data.type0,
              task,
              taskList
            })
            db.collection('team').doc(that.data.teamId).update({
              data: {
                taskList: that.data.taskList,
                unfinishTask: finish ? that.data.unfinishTask : that.data.unfinishTask - 1
              }
            })
            if (that.data.taskList.length == 0) {
              that.setData({
                de: 1
              })
            }

          } else if (res.cancel) {
            console.log('【task-list】【长按删除】【点击取消】');
            return false;
          }

        }
      })
    }
  },
  onChangeShowState: function(event) {
    var that = this;
    // var toggleBtnVal = that.data.uhide;
    // var itemId = event.currenTarget.id;
    // if(toggleBtnVal == itemId){

    // }
  },
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      console.log('【task-list】【分享方式】【通过button分享】', res)
    }
    return {
      title: '邀请你加入' + this.data.teamName + '团队',
      path: '/pages/beInvited/beInvited?teamId=' + this.data.teamId + '&teamName=' + this.data.teamName,
      // imageUrl: '/images/share.png',
    }
  },
  addTask: function(res) {
    var that = this;
    if (this.data.currentTab) {
      if (res.from == 'button') {
        console.log('【task-list】【分享方式】【通过button分享】', res)
      }
      // return {
      //   title: '邀请你加入新团队',
      //   path: '/pages/beInvited/beInvited?teamId=' + this.data.teamId+'&teamName='+this.data.teamName,
      //   imageUrl: '/images/share.png',
      // }

    } else {
      wx.navigateTo({
        url: '/pages/create_task/create_task?teamId=' + that.data.teamId + '&openId=' + that.data.openId + '&userId=' + that.data.userId + '&teamName=' + that.data.teamName + '&unfinishTask=' + that.data.unfinishTask
      })
    }

  },
  bindTaskDetail: function(e) {
    var index = e.currentTarget.dataset.index;
    console.log(this.data.task[index]);
    var that = this;
    if (!that.data.task[index].type) {
      wx.navigateTo({
        url: '/pages/task/task?taskId=' + that.data.task[index]._id + '&teamName=' + that.data.teamName + '&userId=' + that.data.userId + '&leaderId=' + that.data.leaderId + '&openId=' + that.data.openId
      })
    } else {
      wx.navigateTo({
        url: '/pages/inform/inform?taskId=' + that.data.task[index]._id + '&teamName=' + that.data.teamName + '&userId=' + that.data.userId + '&leaderId=' + that.data.leaderId
      })
    }

  },
  onToggle: function() {
    this.setData({
      showToolbar: !this.data.showToolbar
    });
  },

  onAdd: function() {
    wx.navigateTo({
      url: '/pages/create_inform/create_inform?teamId=' + this.data.teamId + "&openId=" + this.data.openId + "&userId=" + this.data.userId + "&teamName=" + this.data.teamName + "&unfinishTask=" + this.data.unfinishTask
    });
  },

  onAddDigest: function() {
    wx.navigateTo({
      url: '/pages/create_task/create_task?teamId=' + this.data.teamId + "&openId=" + this.data.openId + "&userId=" + this.data.userId + "&teamName=" + this.data.teamName + "&unfinishTask=" + this.data.unfinishTask
    })
  },
  ffinish:function(){
    if(this.data.finished){
      this.setData({
        taskListLength: this.data.typeunfinish,
        finished: false
      })
    }
    else{
      this.setData({
        taskListLength: this.data.type0 * 220 + this.data.type1 * 130 + 10,
        finished: true
      })
    }
  },
})