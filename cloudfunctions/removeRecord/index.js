const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const col = cloud.database().collection('acceptors');

exports.main = async (event, context) => {
  const { id, recordId } = event;
  try {
    const acceptor = (await col.doc(id).get()).data;
    const result = await col.doc(id).update({
      data: {
        records: (acceptor.records || []).filter(record => record._id != recordId),
      },
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