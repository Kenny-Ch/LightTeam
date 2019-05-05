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
    teamId: '',
    userId: '',
    userList: [],
    batchIds: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('【choosemember】【create_task界面传入参数】', options)
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
          userList: res.data[0].userList,
        })
        console.log('【chooosemember】【获取指定的team信息】【获取成功】', res.data[0])
        // console.log(res.data[0].userList)
      }
    })

  },
  selectall: function (e) {
    console.log(e)
    var that = this;
    var arr = [];   //存放选中id的数组
    for (var i = 0; i < that.data.userList.length; i++) {
      that.data.userList[i].checked = !that.data.select_all
      if (that.data.userList[i].checked == true) {
        // 全选获取选中的值
        arr = arr.concat(that.data.userList[i].id.split(","));
      }
    }
    for(var i=0;i< arr.length;i++){
      for(var j=0;j< that.data.userList.length;j++){
        if(arr[i]==that.data.userList[j].id){
          arr[i]=that.data.userList[j];
          break;
        }
      }
    }
    that.setData({
      userList: that.data.userList,
      select_all: (!that.data.select_all),
      batchIds: arr
    })
  },

  bindchange:function(e){
    var that = this;
    if (e.detail.value.length==this.data.userList.length)
    {
      that.setData({
        select_all : true,
      })
    }
    else
    {
      
      that.setData({
        select_all : false,
      })
    }
    var arr = [];
    for (var i = 0; i < e.detail.value.length; i++) {
      for (var j = 0; j < that.data.userList.length; j++) {
        if (e.detail.value[i] == that.data.userList[j].id) {
          arr[i] = that.data.userList[j];
          break;
        }
      }
    }
    that.setData({
      batchIds:arr,
    })
  },
})