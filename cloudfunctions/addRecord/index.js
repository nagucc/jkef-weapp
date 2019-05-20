const uuidv4 = require('uuid/v4');
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const col = cloud.database().collection('acceptors');

exports.main = async (event, context) => {
  const { id, record } = event;
  try {
    // 预处理记录数据
    record._id = uuidv4();
    record.date = new Date(record.date);
    record.amount = Math.round(record.amount * 1000); // 为避免精度问题，按整数存储
    const acceptor = (await col.doc(id).get()).data;
    const result = await col.doc(id).update({
      data: {
        records: [
          ...(acceptor.records || []),
          record,
        ],
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