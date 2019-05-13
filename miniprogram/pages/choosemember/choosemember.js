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
  onShow(){
    // var that = this;
    // try {
    //   var value = wx.getStorageSync('batchIds')
    //   if (value) {
    //     that.setData({
    //       batchIds:value
    //     })
    //   }
    // } catch (e) {}
    // for(var i=0;i<that.data.batchIds.length;i++){
    //   for(var j=0;that.data.userList;j++){
    //     if (that.data.batchIds[i].id == that.data.userList[j].id){
    //       that.data.userList[j].checked = true;
    //       break;
    //     }
    //   }
    //   if(i==that.data.batchIds.length-1){
    //     that.setData({
    //       userList:that.data.userList
    //     })
    //   }
    // }
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
    var array=[];
    for(var i=0;i< arr.length;i++){
      for(var j=0;j< that.data.userList.length;j++){
        if(arr[i]==that.data.userList[j].id){
          array.push({ "id": that.data.userList[j].id, "Url": that.data.userList[j].Url, "nickName": that.data.userList[j].nickName})
          break;
        }
      }
    }
    that.setData({
      userList: that.data.userList,
      select_all: (!that.data.select_all),
      batchIds: array
    })
  },

  bindchange:function(e){
    console.log(e.detail)
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
    var array=[];
    for (var i = 0; i < e.detail.value.length; i++) {
      for (var j = 0; j < that.data.userList.length; j++) {
        if (e.detail.value[i] == that.data.userList[j].id) {
          console.log(e.detail.value[i],that.data.userList[j].id)
          array.push({ "id": that.data.userList[j].id, "Url": that.data.userList[j].Url, "nickName": that.data.userList[j].nickName })
          break;
        }
      }
    }
    that.setData({
      batchIds:array,
    })
  },
  submit:function(){
      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[pages.length - 2];//prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
      let that=this;
      prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
        batchIds:that.data.batchIds,
      })
//上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。
//最后就是返回上一个页面。
wx.navigateBack({
        delta: 1  // 返回上一级页面。
    })
  },
})