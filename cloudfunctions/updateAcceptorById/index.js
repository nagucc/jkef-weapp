const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const col = cloud.database().collection('acceptors');

exports.main = async (event, context) => {
  try {
    const result = await col.doc(event.id).update({
      data: event.acceptor,
    });
    return {
      ret: 0,
      data: result,
    };
  } catch (err) {
    return {
      ret: -1,
      msg: err,
    };
  }
}