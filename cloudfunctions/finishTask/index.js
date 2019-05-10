const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    return await db.collection('task').doc(event.taskId).update({
      data: {
        finish:true
      }
    })
  } catch (e) {
    console.error(e)
  }
}