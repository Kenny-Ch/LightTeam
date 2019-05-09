const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('team').doc(event.teamId).update({
      data: {
        userList: db.command.push({"id":event.id,"nickName":event.nickName,"Url":event.url}),
        userNum: event.len+1
      }
    })
  } catch (e) {
    console.error(e)
  }
}