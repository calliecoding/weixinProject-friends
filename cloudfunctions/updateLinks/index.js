// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event);
  try {
    if(typeof event.data== 'string'){
      console.log("event.data== 'string'");
      event.data = eval(`(${event.data})`)
      console.log(5);
      
    }
   console.log(4);
    if(event.doc){
      console.log(2);
      return await db.collection(event.collection).doc(event.doc)
      .update({
        data: {
          ...event.data
        },
      })
    }else{
      console.log(3);
      return await db.collection(event.collection).where(event.where)
      .update({
        data: {
          ...event.data
        },
      })
    }
   
  } catch (e) {
    console.error(e)
  }
}