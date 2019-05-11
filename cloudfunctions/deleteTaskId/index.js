// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  for(var i=0;i<event.userList.length;i++){
    var user = await db.collection('user').doc(event.userList[i].id).get();
    var arr=new Array();
    for(var j=0;j<user.data.taskList.length;j++){
      if(event.taskId!=user.data.taskList[j])
        arr.push(user.data.taskList[j]);
    }
     await db.collection('user').doc(event.userList[i].id).update({
          data: {
            taskList: arr
          }
        })
    }
}
