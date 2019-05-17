// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const acceptors = await cloud.callFunction({
    name: 'getAcceptors',
  });
  const statByProject = {};
  const statByYear = {};
  acceptors.result.data.forEach(acc => {
    if (!acc.records) return;
    acc.records.forEach(record => {
      // 按项目统计
      if (!statByProject[record.project]) statByProject[record.project] = {
        count: 0,
        amount: 0.0,
        lastUpdated: new Date(1900),
      }
      statByProject[record.project] = {
        count: statByProject[record.project].count + 1,
        amount: statByProject[record.project].amount + record.amount/1000.0,
        lastUpdated: statByProject[record.project].lastUpdated.getTime() > (new Date(record.date)).getTime()
          ? statByProject[record.project].lastUpdated
          : new Date(record.date),
      }

      // 按年份统计
      const year = (new Date(record.date)).getFullYear();
      if (!statByYear[year]) statByYear[year] = {
        count: 0,
        amount: 0.0,
        lastUpdated: new Date(1900),
      }
      statByYear[year] = {
        count: statByYear[year].count + 1,
        amount: statByYear[year].amount + record.amount/1000.0,
        lastUpdated: statByYear[year].lastUpdated.getTime() > (new Date(record.date)).getTime()
          ? statByYear[year].lastUpdated
          : new Date(record.date),
      }
    });
  });
  const db = cloud.database();
  const _ = db.command
  const colProject = db.collection('stat_by_project');
  const colYear = db.collection('stat_by_year');

  // 清空统计集合
  await colProject.where({
    _id: _.neq(''),
  }).remove();
  await colYear.where({
    _id: _.neq(''),
  }).remove();

  // 插入数据
  const promises = [];
  Object.entries(statByProject).forEach(kv => {
    const res = colProject.add({
      data: {
        _id: kv[0],
        value: kv[1],
      }
    });
    promises.push(res);
  });
  Object.entries(statByYear).forEach(kv => {
    const res =  colYear.add({
      data: {
        _id: kv[0],
        value: kv[1],
      }
    });
    promises.push(res);
  });
  const result = await Promise.all(promises);
  return result;
}