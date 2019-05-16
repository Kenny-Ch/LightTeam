const db = wx.cloud.database()
const teamCollection = db.collection('team')
const userCollection = db.collection('user')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hide:false,
    teamId:'',
    userList:[],
    teamName:'',
    userId:'',
    openId:'',
    userOtherName:'',
    listLength:0,
    hasLogined:false,
    userInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('【beinvited】【传入新建团队id参数】【传入团队id参数成功】',options)
    var that=this;
    this.setData({
      teamId : options.teamId,
      teamName : options.teamName,
      openId : getApp().globalData.openid
    })
    
    teamCollection.doc(options.teamId)
      .get({
        success: res => {
          console.log('【beinvited】【获取指定team信息】【获取成功】', res.data),
            this.setData({
              userList:res.data.userList,
              listLength:res.data.userList.length
            })
            //先获得指定team的成员列表，下面检查加入的成员是不是已经有了
          var uList = res.data.userList
          var llength = res.data.userList.length
          wx.getSetting({
            success: res => {
              //先判断是否授权，未授权要跳到第一个授权界面
              if (res.authSetting['scope.userInfo']) {
                console.log("【beinvited】【用户授权】【已授权】")
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {
                    console.log('【beinvited】【获取用户信息】【获取信息成功】', res.userInfo)//调试：输出获取到的用户信息判断是否成功获取
                    this.setData({
                      hasLogined:true,
                      userInfo: res.userInfo//把成功获取的内容存到这个page的data里面
                    })
                    // this.globalData.userInfo=res.userInfo
                    // wx.cloud.callFunction({
                    //   name: 'getOpenid', 
                    //   complete: res => {
                    //     this.globalData.openid = res.result.openid;
                    //   }
                    // }),
                    wx.cloud.callFunction({
                      name: 'login',
                      data: {},
                      success:res=> {
                        console.log(res)
                        db.collection('user').where({
                          _openid:res.result.openid})
                          .get({
                            success: res => {
                              console.log('【beinvited】【获取指定用户user集合中的记录id】【获取成功】', res.data[0]._id,res)
                              //通过上面通过openid在集合获得的id去对照成员列表
                              //并且通过遍历找到是否存由该成员
                              //有则去index界面
                              //无则去填入备注并加入团队
                              for (var i = 0; i <=uList.length; i++) {
                                if(i==uList.length&&this.data.hide==false){
                                  this.setData({
                                    hide:true
                                  })
                                  console.log('【beinvited】【用户是否已存在团队之中】，【不存在同时显示加入团队按钮】')
                                  break;
                                }
                                if (uList[i].id ==res.data[0]._id) {
                                  wx.switchTab({
                                    url: '/pages/index/index'
                                  })
                                  console.log('【beinvited】【用户是否已存在团队之中】，【已存在并跳转首页】')
                                  break;
                                }
                              }
                            }
                          })
                      }
                       
                     
                    })
                    // console.log("【用户信息存入】【信息成功存入globalData中】", getApp().globalData)//若完成上一步走到这一步的话输出“成功”
                  }
                })
              }
              else{
                that.setData({
                  hasLogined:false
                })
              }
            }
          })
          
        }
      })
    
    
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      wx.getSetting({
        success: res => {
          var that = this;
          //先判断是否授权，未授权要跳到第一个授权界面
          if (res.authSetting['scope.userInfo']) {
            console.log("【beinvited】【用户授权】【已授权】")
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                console.log('【beinvited】【获取用户信息】【获取openid信息成功】', res.userInfo)//调试：输出获取到的用户信息判断是否成功获取
                //插入登录的用户的相关信息到数据库
                wx.cloud.callFunction({
                  name: 'login',
                  data: {},
                  success: res => {
                    console.log('【index】【云函数获取openid】【成功获取】', res.result.openid)
                    that.setData({
                      openId: res.result.openid
                    })
                    db.collection('user').where({
                      _openid: that.data.openId
                    }).get({
                      success(res) {
                        console.log(res.data)
                        if (!res.data.length) {
                          db.collection('user').add({
                            data: {
                              avatarUrl: that.data.userInfo.avatarUrl,
                              nickName: that.data.userInfo.nickName,
                              taskList: [],
                              teamList: []
                            },
                            success(res) {
                              // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                              console.log(res)
                            },
                            fail: console.error
                          })
                        }
                      }
                    })
                  },
                  fail: err => {
                    console.error('【index】【云函数获取openid】【失败】', err)
                  }
                })
              }
            })
            that.setData({
              hide:true
            })
          }
        }
      })

      //授权成功后，跳转进入小程序首页
      
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '提示',
        content: '您还未登录，登录后可获得完整体验哦',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('【beinvited】【用户点击了“返回授权”】')
          }
        }
      })
    }
  },
  onUserOtherNameInput: function (e) {
    this.setData({
      userOtherName: e.detail.value
    })
  },
  addTeam:function(e){
    if(this.data.userOtherName){
          db.collection('user').where({
            _openid: this.data.openId
          })
            .get({
              success: res => {
                this.setData({
                  userId:res.data[0]._id
                })
                console.log('【beinvited】【获取指定用户user集合中的记录id】【获取成功】', res.data[0]._id, res)
                teamCollection.doc(this.data.teamId)
                  .get({
                    success: res => {
                      console.log('【beinvited】【获取指定team信息】【获取成功】', res.data),
                        this.setData({
                          listLength: res.data.userList.length
                        })
                      wx.cloud.callFunction({
                        name: 'addTeamMember',
                        data: {
                          teamId: this.data.teamId,
                          id: this.data.userId,
                          nickName: this.data.userOtherName,
                          url: this.data.userInfo.avatarUrl,
                          len: this.data.listLength
                        },
                      })
                      var that = this;
                      db.collection('user').doc(that.data.userId).update({
                        data: {
                          teamList: db.command.push(that.data.teamId)
                        }
                      })
                      if (!this.data.hasLogined){
                        wx.redirectTo({
                          url: '/pages/guidance/guidance'
                        })
                      }
                      else{
                        wx.switchTab({
                          url: '/pages/index/index',
                        })
                      }
                    }
                  })
              }
            })
    }
  },
  
})