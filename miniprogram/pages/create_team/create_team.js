// pages/create_team/create_team.js
const db = wx.cloud.database()
const _ = db.command
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
    console.log('【index界面传入参数】【传入成功】',options)
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
          openid: res.result.openid
        })
          .get({
            success: res => {
              console.log('【获取指定用户user集合中的记录id】【获取成功】', res.data[0]._id)
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
      console.log('【团队名称输入情况】【未输入】',event)
      wx.showToast({
        title: '团队的名称未填写哟~',
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
          "leader":this.data.openId,
          "taskList":[],
          "unfinishTask":-1,
          "userList":[{
            "Url":this.data.url,
            "nickName":this.data.nickName,
            "id":this.data.userId
          }],
          "userNum":-1
        },
        success: res => {
          this.setData({
            teamid:res._id
          })
          console.log('【添加团队信息】【成功添加团队信息】', this.data,this.data.userId,this.data.teamid)
          db.collection('user').doc('XK4Oqkftrkci08g').update({
            data: {
              taskList: _.push(['123'])
            }
          }).then(res=>{
            console.log(res)
          })
          wx.redirectTo({
            url: '/pages/invite/invite?teamid=' + res._id
          })
        }
      })
      
    }
  
  }
})