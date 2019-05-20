const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async(event, context) => {
  var time=0;
  if (event.remind == '1天')
    time = -86400000 + 28800000
  else
    time = -3600000 + 28800000
  var date = new Date(new Date().getTime() + time);
  var currentDate = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + ' ' + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
  var res = await db.collection('templateMsg').where({
    endTime: db.command.lte(currentDate)
  }).get()
  var arr = res.data;
  try {
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr[i].openId.length; j++) {
        await cloud.callFunction({
          name: 'templateMsg',
          data: {
            openId: arr[i].openId[j],
            userId: arr[i].userId[j],
            formId: arr[i].formId[j],
            leaderId: arr[i].leaderId,
            taskId: arr[i].taskId,
            teamName: arr[i].teamName,
            taskName: arr[i].taskName,
            endTime: arr[i].endTime,
            remind: arr[i].remind,
          }
        })
        await db.collection('templateMsg').doc(arr[i]._id).remove({
          success: console.log,
          fail: console.error
        })
      }
    }
  } catch (e) {
    console.error(e)
  }
}