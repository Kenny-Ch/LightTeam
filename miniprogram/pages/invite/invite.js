Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
 
  /**
   * 用户点击分享
   */
  onShareAppMessage: function (res) {
  if(res.from === 'button'){
   console.log(res.target)
  }
  var id = 123456;
  

  return{
    title: '邀请你加入新团队',
    path: '/page/index/index?teamId=' + teamId ,
    imageUrl: '/images/share.png',
    }
  }
})