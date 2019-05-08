Page({

  /**
   * 页面的初始数据
   */
  data: {
    teamid:'',
    teamName:''
  },
  onLoad: function(options){ 
    this.data.teamid=options.teamid,
    this.data.teamName=options.teamName,
    console.log('【invite】【传入参数options】', options)
  },
  /**
   * 用户点击分享
   */
  onShareAppMessage: function (res) {
  if(res.from === 'button'){
    console.log('【invite】【分享方式】【通过button分享】',res)
  }
  return{
    title: '邀请你加入新团队',
    path: '/pages/beInvited/beInvited?teamId=' + this.data.teamId+'&teamName='+this.data.teamName,
    imageUrl: '/images/share.png',
    }
  }
})