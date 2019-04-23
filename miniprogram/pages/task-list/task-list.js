// pages/detail-task/detal-task.js
const db = wx.cloud.database()
const _ = db.command
const teamCollection = db.collection('team')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    boxStyle:'box_b',
    up:true,
    down:false,
    teamName:'',
    memberNum:'',
    teamIntroduce:'',
    taskList:[],
    task:[],
    userList:[]
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
    console.log('【task-list】【index界面传入参数】',options)
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
          taskList:res.data[0].taskList,
          userList:res.data[0].userList
        })
        console.log('【task-list】【获取指定的team信息】【获取成功】',res.data[0])
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
        console.log('【task-list】【获取指定的task信息】【获取成功】',that.data.task)
      }
    })
    

    showView: (options.showView == "true" ? true : false)
  },
  longtapDelete:function(e){
    var that = this;
    var task = that.data.task;
    var taskList = that.data.taskList;
    var index = e.currentTarget.dataset.index;//获取当前长按图片下标
    console.log(e)
    wx.showModal({
      title: '提示',
      content: '确定要删除此任务吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('【task-list】【长按删除】【点击确定】', '索引为：', index);
          task.splice(index, 1);
          taskList.splice(index, 1);
          db.collection('user').doc('').update({
            data: {
              style: _.remove()
            }
          })
        } else if (res.cancel) {
          console.log('【task-list】【长按删除】【点击取消】');
          return false;
        }
        that.setData({
          task,
          taskList
        });
      }
    })
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

  height: function (e) {
    if (showView) {
      var box = e.target.id;
    }
  }
})