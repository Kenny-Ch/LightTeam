// pages/create_team/create_team.js
const db = wx.cloud.database()
const teamCollection = db.collection('team')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    teamName: "",
    teamBrief:"",
    teamid:"",
    openId:'',
    userId:'',
    nickName:'',
    url:''
  },
  onLoad:function(options){
    console.log('【create_team】【index界面传入参数】【传入成功】',options)
    this.setData({
      openId:options.openId,
      nickName:options.nickName,
      url:options.url
    })
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        db.collection('user').where({
          _openid: res.result.openid
        })
          .get({
            success: res => {
              console.log('【create_team】【获取指定用户user集合中的记录id】【获取成功】', res.data[0]._id)
              this.setData({
                userId: res.data[0]._id
              })
            }
          })
      }
    })
  },
  teamNameInput: function (e) {
    this.setData({
      teamName: e.detail.value
    })
  },
  briefInput: function (e) {
    this.setData({
      teamBrief: e.detail.value
    })
  },

  addData: function (event) {
    if(!this.data.teamName){
      console.log('【create_team】【团队名称输入情况】【未输入】',event)
      wx.showToast({
        title: '团队的名称未填写哟~',
        icon: 'none',
        duration: 2000
      })
    }
    else if(this.data.teamName.length>12){
      console.log('【create_team】【团队名称输入情况】【过长】', event)
      wx.showToast({
        title: '团队的名称过长哟~请限定在12字以内',
        icon: 'none',
        duration: 2000
      })
    }
    else if (this.data.teamBrief.length > 50) {
      console.log('【create_team】【团队简介输入情况】【过长】', event)
      wx.showToast({
        title: '团队的简介过长哟~请限定在50字以内',
        icon: 'none',
        duration: 2000
      })
    }
    else{
      var that = this;
      teamCollection.add({
        data: {
          "name": this.data.teamName,
          "introduce": this.data.teamBrief,
          "leader":this.data.userId,
          "taskList":[],
          "unfinishTask":0,
          "userList":[{
            "Url":this.data.url,
            "nickName":this.data.nickName,
            "id":this.data.userId
          }],
          "userNum":1
        },
        success: res => {
          this.setData({
            teamid:res._id
          })
          console.log('【create_team】【添加团队信息】【成功添加团队信息】', this.data,this.data.userId,this.data.teamid)
          db.collection('user').doc(this.data.userId).update({
            data: {
              teamList:db.command.push(this.data.teamid)
            }
          })
          let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
          let prevPage = pages[pages.length - 2];//prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
          let that = this;
          db.collection('team').where({
            _id: res._id
          }).get({
            success(res) {
              prevPage.data.team.unshift(res.data[0])
              prevPage.setData({
                team: prevPage.data.team,
                de :0
              })
            }
          })
          // prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
          //   batchIds: that.data.batchIds,
          // })
          //上一个页面内执行setData操作，将我们想要的信息保存住。当我们返回去的时候，页面已经处理完毕。
          wx.redirectTo({
            url: '/pages/invite/invite?teamid=' + res._id+'&teamName='+this.data.teamName
          })
        }
      })
      
    }
  
  }
})