// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init();
const db = cloud.database()
const col = cloud.database().collection('acceptors');

// 云函数入口函数
exports.main = async (event, context) => {
  const { _id } = event;
  let acceptor = null;
  try {
    const result = await col.doc(_id).get();
    acceptor = result.data;
  } catch(err) {
  }
  
  return acceptor;
}