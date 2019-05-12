// pages/choosemember/choosemember.js
const db = wx.cloud.database()
const teamCollection = db.collection('team')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select_all: false,
    teamName: '',
    memberNum: '',
    openId: '',
    taskId: '',
    userId: '',
    userList: [],
    finish:[],
    state:[],
    accept:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('【choosemember】【create_task界面传入参数】', options)
    this.setData({
      taskId: options.taskId,
      teamName:options.teamName
    })
    var that = this;
    db.collection('task').where({
      _id: options.taskId
    }).get({
      success(res) {
        that.setData({
          userList: res.data[0].userList,
          accept:res.data[0].accept,
          finish:res.data[0].finish
        })
        for(var i=0;i<res.data[0].userList.length;i++){
          console.log(that.data.accept[i], that.data.finish)
          if (that.data.finish==true){
            that.data.state.push('已完成')
          }
          else if (that.data.finish == false){
            if (that.data.accept[i]==true){
              that.data.state.push('已收到')
            }
            else if (that.data.accept[i] == false){
              that.data.state.push('未收到')
            }
          }
          // that.data.state.push(that.data.finish ? ('已完成') : (that.data.accept[i] ? '已收到' : '未收到'))
          that.setData({
            state:that.data.state
          })
        }
        console.log('【memberList】【获取指定的task信息】【获取成功】', res.data[0])
        // console.log(res.data[0].userList)
      }
    })

  },
  // selectall: function (e) {
  //   // console.log(e)
  //   var that = this;
  //   var arr = [];   //存放选中id的数组
  //   for (var i = 0; i < that.data.userList.length; i++) {
  //     that.data.userList[i].checked = (!that.data.select_all)
  //     if (that.data.userList[i].checked == true) {
  //       // 全选获取选中的值
  //       arr = arr.concat(that.data.userList[i].id.split(","));
  //     }
  //   }
  //   console.log(arr)
  //   that.setData({
  //     userList: that.data.userList,
  //     select_all: (!that.data.select_all),
  //     batchIds: arr
  //   })

  // },

  // bindall:function(e){
  //   var that = this;
  //   // var arr = [];   //存放选中id的数组
  //   // for (var i = 0; i < that.data.userList.length; i++) {
  //   //   that.data.userList[i].checked = (!that.data.select_all)
  //   //   // console.log(that.data.userList[i].checked)
  //   //   if (that.data.userList[i].checked == true) {
  //   //     // 全选获取选中的值
  //   //     // console.log(that.data.userList[i].id)
  //   //     arr = arr.concat(that.data.userList[i].id.split(","));
  //   //   }
  //   // }
  //   // console.log(e)
  //   // that.setData({
  //   //   batchIds: e.detail.value  //单个选中的值
  //   // })
  //   console.log(e.detail.value)
  //   if (e.detail.checked)
  //   {
  //     that.setData({
  //       select_all : true,
  //     })
  //   }
  //   else
  //   {
  //     that.setData({
  //       select_all : false,
  //     })
  //   }
  //   // console.log(that.data.select_all)
  // }

})