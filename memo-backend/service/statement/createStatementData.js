
/**
 * 计算结算单数据
 * 使用拆分循环（227） 分离出累加过程；
 * 使用移动语句（223） 将累加变量的声明与累加过程集中到一起；
 * 使用提炼函数（106） 提炼出计算总数的函数；
 * 使用内联变量（123） 完全移除中间变量。
 * @param {Object} invoice - invoice
 * @param {string} invoice.customer - invoice customer
 * @param {string} invoice.performances[].playID - invoice performances playID
 * @param {string} invoice.performances[].audience - invoice performances audience
 * @param {Object} plays - plays collection
 * @param {Object} plays[].name - play name
 * @param {Object} plays[].type - play type
 * @return {string} result - 计算结算单数据
 */
function createStatementData(invoice, plays) {
  const customerData = {};
  customerData.customer = invoice.customer;
  customerData.performances = invoice.performances.map(enrichPerformance);
  customerData.totalAmount = totalAmount(customerData);
  customerData.totalVolumeCredits = totalVolumeCredits(customerData);
  console.log(`customerData = ${JSON.stringify(customerData)}`);
  return customerData;

  // 现在我只是简单地返回了一个aPerformance对象的副本， 但马上我就会往这
  // 条记录中添加新的数据。 返回副本的原因是， 我不想修改传给函数的参数， 我总
  // 是尽量保持数据不可变（immutable） ——可变的状态会很快变成烫手的山芋。
  function enrichPerformance(aPerformance) {
    const result = {};
    // 返回一个浅副本
    Object.assign(result, aPerformance);
    result.play = playFor(result);
    result.amount = amountFor(result);
    result.volumeCredits = volumeCreditsFor(result);
    return result;
  }
  // {playID: 'hamlet', audience: 55}
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  /**
     * calculate performance for play
     * @param {Object} aPerformance - a performance
     * @param {string} aPerformance.playID - invoice performances playID
     * @param {string} aPerformance.audience - invoice performances audience
     * @return {Number} amount
     */
  function amountFor(aPerformance) {
    let amount = 0;
    switch (aPerformance.play.type) {
    case 'tragedy':
      amount = 40000;
      if (aPerformance.audience > 30) {
        amount = amount + 1000 * (aPerformance.audience - 30);
      }
      break;
    case 'comedy':
      amount = 30000;
      if (aPerformance.audience > 20) {
        amount = amount + (10000 + 500 * (aPerformance.audience - 20));
      }
      amount = amount + 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`unknown type: ${aPerformance.play.type}`);
    }

    return amount;
  }

  function volumeCreditsFor(perf) {
    let credits = 0;
    credits = credits + Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if (perf.play.type === 'comedy') {
      credits = credits + Math.floor(perf.audience / 5);
    }
    return credits;
  }

  // reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
  function totalVolumeCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
  }

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }
}

module.exports = {
  createStatementData
};
