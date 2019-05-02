const db = wx.cloud.database()
const _ = db.command
const taskCollection = db.collection('task')
const teamCollection = db.collection('team')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamName: 'icode',
    taskName: 'task',
    memberList: [],
    dateBegin: '',
    dateEnd: '',
    timeBegin: '',
    timeEnd: '',
    finish: false,
    tagNum: 0,
    tag: ['', '重要且紧急', '不重要且紧急', '重要且不紧急', '不重要且不紧急'],
    userList: [],
    accept:[],
    userId:'',
    buttonHidden: true,
    i:0,
    state:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      teamName:options.teamName,
      taskId:options.taskId,
      userId:options.userId
    })
    console.log('【task】【task-list界面传参】',options)
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
              accept:res.data.accept
            })
          var date = new Date();
          var currentDate = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate()<10?"0"+date.getDate():date.getDate())+ date.getHours() + ':' + date.getMinutes();
          var begin = this.data.dateBegin + this.data.timeBegin;
          var end = this.data.dateEnd + this.data.timeEnd;
          // if()
          this.setData({
            state:currentDate < begin ? "未开始" : currentDate <=end ? "进行中" : "已截止"
          })
          console.log(currentDate, begin, 'fhdfjdfjdhfhdjfhdhfj', end)
            for(var i=this.data.i;i<this.data.memberList.length;i++)
            {
              if(this.data.memberList[i].id==this.data.userId)
              {
                this.setData({
                  buttonHidden:!this.data.accept[i],
                  i:i
                })
              }
            }

        }
      })
  },
  bindReceiveTask: function () {
    this.data.accept[this.data.i]=true;
    var that=this;
    wx.cloud.callFunction({
      name:"updateAccept",
      data: {
        accept: that.data.accept,
        taskId: that.data.taskId
      },
    }).then(res=>{
      that.setData({
        accept:that.data.accept,
        buttonHidden:false
      })
      console.log("【task】【已接受任务】【更新成功】")
    })
    },
        
      })