const db = wx.cloud.database()
const _ = db.command
const taskCollection = db.collection('task')
const teamCollection = db.collection('team')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamName: '',
    taskName: '',
    taskIntroduction: '',
    memberList: [],
    dateBegin: '',
    dateEnd: '',
    timeBegin: '',
    timeEnd: '',
    finish: false,
    tagNum: 0,
    tag: ['', '重要且紧急', '不重要且紧急', '重要且不紧急', '不重要且不紧急'],
    userList: [],
    accept: [],
    userId: '',
    leaderId: '',
    buttonHidden1: true,
    buttonHidden2: true,
    i: 0,
    state: '',
    taskId: '',
    url:[],
    type:2,
    tmsgid:'',
    openId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      teamName: options.teamName,
      taskId: options.taskId,
      userId: options.userId,
      leaderId: options.leaderId,
      openId: options.openId
    })
    console.log('【task】【task-list界面传参】', options)
    taskCollection.doc(options.taskId)
      .get({
        success: res => {
          console.log('【task】【获取指定用户task信息】【获取成功】', res.data),
            this.setData({
              taskName: res.data.name,
              dateBegin: res.data.startDate,
              dateEnd: res.data.endDate,
              timeBegin: res.data.startTime,
              timeEnd: res.data.endTime,
              finish: res.data.finish,
              tagNum: res.data.tag,
              memberList: res.data.userList,
              accept: res.data.accept,
              taskIntroduction: res.data.taskIntroduction,
              type:res.data.type,
              tmsgid:res.data.tmsgid
            })
          var date = new Date();
          var currentDate = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
          var begin = this.data.dateBegin + this.data.timeBegin;
          var end = this.data.dateEnd + this.data.timeEnd;
          if (this.data.finish) {
            this.setData({
              state: "已完成"
            })
          } else {
            this.setData({
              state: currentDate < begin ? "未开始" : currentDate <= end ? "进行中" : "已截止"
            })
          }
          for (var i = this.data.i; i < this.data.memberList.length; i++) {
            if (this.data.userId == this.data.leaderId) {
              this.setData({
                buttonHidden1: true,
                buttonHidden2: this.data.finish,
              })
              this.data.accept[this.data.i] = true;
              var that = this;
              db.collection('task').doc(that.data.taskId).update({
                data: {
                  accept: that.data.accept
                }
              })
              break;
            }
            if (this.data.memberList[i].id == this.data.userId) {
              this.setData({
                buttonHidden1: this.data.accept[i],
                buttonHidden2: this.data.finish,
                i: i
              })
              if (!this.data.buttonHidden1) {
                this.setData({
                  buttonHidden2: true
                })
              }
              break;
            }
          }
          for (var i = 0; i < this.data.memberList.length; i++) {
            if (i <= 7) {
              if (i == 7) {
                this.data.url.push();
              }
              else {
                this.data.url.push(this.data.memberList[i].Url);
              }
            }
            else{
              this.data.url.push();
            }
          }
          this.setData({
            url: this.data.url
          })
        }
      })
  },
  bindMemberDetail: function() {
    wx.navigateTo({
      url: '/pages/memberList/memberList?accept=' + this.data.accept + '&taskId=' + this.data.taskId + '&finish=' + this.data.finish + '&teamName=' + this.data.teamName
    })
  },
  bindReceiveTask: function(e) {
    this.data.accept[this.data.i] = true;
    var that = this;
    wx.cloud.callFunction({
      name: "updateAccept",
      data: {
        accept: that.data.accept,
        taskId: that.data.taskId,
        formId: e.detail.formId,
        openId: that.data.openId,
        userId: that.data.userId,
        tmsgid: that.data.tmsgid,
        type:0
      },
    }).then(res => {
      that.setData({
        accept: that.data.accept,
        buttonHidden1: true,
        buttonHidden2: false
      })
      console.log("【task】【已接受任务】【更新成功】")
    })
  },
  finishtask: function() {
    wx.cloud.callFunction({
      name: 'finishTask',
      data: {
        taskId: this.data.taskId
      },
    })
    this.setData({
      buttonHidden2: true,
      state: "已完成"
    })
  }
})