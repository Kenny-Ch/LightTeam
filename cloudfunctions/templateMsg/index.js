// 云函数入口文件
const got = require('got')
const cloud = require('wx-server-sdk')
cloud.init()

let appid = 'wx649b51cafacdd3a1';
let secret = '1cfc9a800b6366c78defaef5cc69387d';
let tokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret;
let template_id ='_XIgodNTV5VuC_Z5BAeLhK6MxNgNCq6IP42lWxOQEYY'
let msgUrl ='https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let tokenResponse=await got(tokenUrl);
  let token=JSON.parse(tokenResponse.body).access_token;
  let msgResponse=await got(msgUrl+token,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({
      "touser": event.openId,
      "template_id": template_id,
      "page": '/pages/task/task?taskId=' + event.taskId + '&teamName=' + event.teamName + '&userId=' + event.userId + '&leaderId=' + event.leaderId,
      "form_id": event.formId ,
      "data": {
        "keyword1": {
          "value": event.taskName
        },
        "keyword2": {
          "value": event.endTime
        },
        "keyword3": {
          "value": event.teamName
        },
        "keyword4": {
          "value": "距离截止时间还有"+event.remind
        }
      }
    })
  })
  return 0;
}