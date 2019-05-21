// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    await db.collection('task').doc(event.taskId).update({
      data: {
        accept: event.accept
      }
    })
  } catch (e) {
    console.error(e)
  }
  if(event.type==0){
    try {
      await db.collection('templateMsg').doc(event.tmsgid).update({
        data: {
          openId: db.command.push(event.openId),
          formId: db.command.push(event.formId),
          userId: db.command.push(event.userId)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}