const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command
exports.main = async (event, context) => {
  try {
    return await db.collection('team').doc('event.id').update({
      data: {
        userList: _.push([{"id":event.id,"nickName":event.nickName,"Url":event.url}])
      }
    })
  } catch (e) {
    console.error(e)
  }
}