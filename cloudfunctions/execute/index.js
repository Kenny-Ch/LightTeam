const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  var date = new Date(new Date().getTime() + 28800000);
  var currentDate = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
  var res = await db.collection('templateMsg').where({
    endTime: db.command.gte(currentDate)
  }).get()
  var arr = res.data;
  console.log('数据准备：',date,'前面的是date，后面的是currentDate：', currentDate, res, arr)
  try {
    for (var i = 0; i < arr.length; i++) {
      console.log('arr遍历', i,arr[i].openId.length)
      for (var j = 0; j < arr[i].openId.length; j++) {
        console.log('便利中')
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
        console.log('fdfdfdfdfd',arr[i]._id,'dfdfdfdf')
        await db.collection('templateMsg').doc(arr[i]._id).remove({
          success: console.log,
          fail: console.error
        })
      }
    }
  } catch (e) {
    console.error(e)
  }
  console.log('打印一下参数',event)
}