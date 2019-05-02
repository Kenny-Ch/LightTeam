const db = wx.cloud.database()
const taskCollection = db.collection('task')
Page({
   
   /* 页面的初始数据
   */
  data: {
    remind:0,
    checkbox:[
      { name:"创建任务后马上提醒大家"},
      { name: "创建任务后马上提醒大家"},
      { name: "创建任务后马上提醒大家"},
      ],
    multiIndex: [0, 0, 0],
    taskid:'',
    taskName:'',
    dateBegin: '请选择开始日期',
    dateEnd: '请选择结束日期',
    timeBegin: '请选择开始时间',
    timeEnd:'请选择结束时间',
    index: 0,
    tag: ['','重要且紧急', '不重要且紧急', '重要且不紧急','不重要且不紧急'],
    tagItem: '全部',
    teamId:'',
    userId:'',
    taskList:[],
    url:''
    },
  onLoad: function (options) {
    console.log('【create_task】【task-list界面传入参数】', options)
    this.setData({
      teamId: options.teamId,
      openId: options.openId,
      userId: options.userId,
      teamName: options.teamName
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
  bindTaskNameInput: function (e) {
    this.setData({
      taskName: e.detail.value
    })
  },
  bindMentionTime(e){
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
  bindTagChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindSave: function(){
    taskCollection.add({
      data: {
        "name":this.data.taskName,
        "startDate": this.data.dateBegin,
        "endDate": this.data.dateEnd,
        "startTime":this.data.timeBegin,
        "endTime":this.data.timeEnd,
        "accept":[false],
        "finish":false,
        "tag":this.data.index,
        "userList":[{'id':this.data.userId,'Url':'','nickName':''}],
        "team":this.data.teamId,
        "teamName":this.data.teamName
      },
      success: res => {
        console.log(this.data)
        this.setData({
          taskid: res._id
        })
        var that = this;
        // db.collection('user').where({
        //   _id: that.data.userId 
        // }).get().then(res => {
        //   that.setData({
        //     taskList:res.data[0].taskList
        //   })
        //   that.data.taskList.push(that.data.taskid)
          db.collection('user').doc(that.data.userId).update({
            data: {
              taskList:db.command.push(that.data.taskid)
            },
          })
        // })
        db.collection('team').doc(that.data.teamId).update({
          data:{
            taskList:db.command.push(that.data.taskid)
          },
        })
        // wx.redirectTo({
        //   url: '/pages/task-list/task-list',
        // })
        console.log('【create_task】【添加任务信息】【成功添加任务信息】', res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */


})