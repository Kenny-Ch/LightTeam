// pages/maintask/maintask.js
const db = wx.cloud.database()
const teamCollection = db.collection('team')
const taskCollection = db.collection('task')
const userCollection = db.collection('user')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showView: false,
    i:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    showView: (options.showView == "true" ? true : false)
    console.log(options.id)
    taskCollection.where({
      'userList.id' : options.id
    }).get({
      success: res => {
        that.setData({
          task: res.data
        })
        var Id = res.data;
        console.log(Id)
        taskCollection.doc(Id).get({
          success : res => {
            that.setData({
              task : res.data
            })
          }
        })
      }
    })
    
//     userCollection.doc(options.id).get({
// success: res => {
//   this.setData({
//     user : res.data
//   })
//   console.log(res.data)
//   var task = res.data.taskList;
//   var num = task.length;
//   var taskList = new Array(num);
//   console.log("hello");
//   for (var j = 0;j < num;j++){

//     console.log(this.data.i);
//    const that=this;
//     taskCollection.doc(task[i]).get({
//       success: res => {
//       taskList[j] = res.data;
//       console.log('')
//       }
//     })
//         this.setData({
//       i:j+1
//     })
//   }
 
// }
//     })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  catchTheID: function (event) {
    var that = this;
    var Id = event.currentTarget.id;
    var boxid = that.data.uhide;
    console.log('boxid:' + boxid)
    if (boxid == Id) {
      that.setData({
        uhide: 0
      })
    } else {
      that.setData({
        uhide: Id
      })
    }


  },
  height:function(e){
    if(showView)
    {
      var box=e.target.id;
      
    }
  }
})