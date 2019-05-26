const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
exports.main = async (event, context) => {
  try {
    await db.collection('task').doc(event.taskId).update({
      data: {
        finish:true
      }
    })
  } catch (e) {
    console.error(e)
  }
  var unfinish = 0;
  try {
    var team = unfinsh = await db.collection('team').doc(event.teamId).get()
    unfinish = parseInt(team.data.unfinishTask)
  } catch (e) {
    console.error(e)
  }
  try {
    await db.collection('team').doc(event.teamId).update({
      data: {
        unfinishTask:unfinish-1
      }
    })
  } catch (e) {
    console.error(e)
  }
  try {
    await db.collection('templateMsg').where({
      _id:event.tmsgid
    }).remove()
  } catch (e) {
    console.error(e)
  }
}