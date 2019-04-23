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
    finish: true,
    tagNum: 10,
    tag: ['重要且紧急', '不重要且不紧急', '重要且不紧急', '不重要且不紧急'],
    userList: [],
    buttonHidden: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.teamId)
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
              memberList: res.data.userList
            })
        }
      }),
      teamCollection.doc(options.teamId)
        .get({
          success: res => {
            console.log('【task】【获取指定用户team信息】【获取成功】', res.data),
              this.setData({
                teamName: res.data.name
              })
          }
        })
  },
  bindRecieveTask: function () {
    teamCollection.doc(options.teamId)
      .get({
        success: res => {
          console.log('【task】【获取指定team信息】【获取成功】', res.data)
                    // this.setData({
                    //   leaderId: res.data.name,
                    //   userList: res.data.userList,
                    //   listLength: res.data.userList.length
                    // })
                    //先获得指定team的成员列表，寻找并获取对应下标
          var uList = res.data.userList
          wx.cloud.callFunction({
            name: 'login',
            data: {},
            success: res => {
              db.collection('user').where({
                openid: res.result.openid
              })
                .get({
                  success: res => {
                    console.log('【task】【获取指定用户user集合中的记录id】【获取成功】', res.data[0]._id, uList[0].id)
                    //通过上面通过openid在集合获得的id去对照成员列表
                    //并且通过遍历找到是否存由该成员
                    for (var i = 0; i <= uList.length; i++) {
                      if (i == uList.length && this.data.hide == false) {
                        this.setData({
                          // hide:true
                        })
                        console.log('【task】【用户是否已存在团队之中】，【不存在同时显示加入团队按钮】')
                        break;
                      }
                      if (uList[i].id == res.data[0]._id) {
                        this.setData({
                          buttonHidden: false
                        })
                        console.log('【task】【用户是否已存在团队之中】，【已存在并跳转首页】')
                        break;
                      }
                    }
                  }
                })
            }


          })
          }
        })
        },
        
      })