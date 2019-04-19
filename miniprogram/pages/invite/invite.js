Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamid:''
  },
  onLoad: function(options){ 
    this.data.teamid=options.teamid,
    console.log('【传入参数options】', options)
  },
  /**
   * 用户点击分享
   */
  onShareAppMessage: function (res) {
  if(res.from === 'button'){
   console.log('【分享方式】【通过button分享】',res)
  }
  return{
    title: '邀请你加入新团队',
    path: '/pages/index/index?teamId=' + this.data.teamId ,
    imageUrl: '/images/share.png',
    success(res) {
      console.log('成功');
      wx.redirectTo({
        url: '/pages/index/index',
      })
      
    }
    }
  }
})