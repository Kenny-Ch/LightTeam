//index.js
const app = getApp()
const db = wx.cloud.database()
const teamCollection = db.collection('team')
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    openId:'',
    teamList: [],
    team:[],
    de: 0,
  },
  
  onLoad: function(options) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) { // 已经授权
          wx.getUserInfo({
            success: res => {
              this.setData({
                userInfo: res.userInfo//把成功获取的内容存到这个page的data里面
              })
              console.log("【index】【用户信息存入】【userInfo信息成功存入data中】", res.userInfo )//若完成上一步走到这一步的话输出“成功”
            }
          })
        }
        else{
          wx.redirectTo({
            url: '/pages/authorization_main/authorization_main',
          })
        }
      }
    })
    var that = this;
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('【index】【云函数获取openid】【成功获取】', res.result.openid)
        this.setData({
          openId: res.result.openid
        })
      //  从user集合中获取该用户所参与的所有teamid：
        db.collection('user').where({
          _openid: res.result.openid 
        }).get({
          success(res) {
            that.setData({
              userId:res.data[0]._id,
              teamList: res.data[0].teamList
            })
            console.log('【index】【user集合中获取该用户所参与的所有teamid】【获取成功】',that.data.teamList)
            for (var i = 0; i < that.data.teamList.length; i++) {
              db.collection('team').where({
                _id: that.data.teamList[i]
              }).get({
                success(res) {
                  that.data.team.unshift(res.data[0])
                  that.setData({
                    team: that.data.team
                  })
                }
              })
            }
            console.log('【index】【通过openid获得用户的所有team】【成功复制至data中team数组中】', that.data.team)
            if (that.data.teamList.length == 0) {
              that.setData({
                de: 1
              })
            }
          }
        })
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('【index】【云函数获取openid】【失败】', err)
      }
    })
    
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
    else{
      console.log('12122121')
    }
  },
  addTeam:function(){
    console.log(this.data.userInfo, this.data.openId)
    wx.navigateTo({
      url: '/pages/create_team/create_team?nickName='+this.data.userInfo.nickName+'&url='+this.data.userInfo.avatarUrl+'&openId='+this.data.openId
    })
  },
  teamDetail:function(e){
    var index = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/task-list/task-list?openId=' + this.data.openId + '&userId=' + this.data.userId + '&teamId=' + this.data.team[index]._id
    })
  }
})
