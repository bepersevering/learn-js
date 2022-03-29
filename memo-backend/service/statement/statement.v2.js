/**
 * 结算单
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
 * @return {string} result - 结算单
 */
function statement(invoice, plays) {
  /**
   * calculate performance for play
   * @param {Object} aPerformance - a performance
   * @param {string} aPerformance.playID - invoice performances playID
   * @param {string} aPerformance.audience - invoice performances audience
   * @return {Number} amount
   */
  function amountFor(aPerformance) {
    let amount = 0;
    switch (playFor(aPerformance).type) {
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
      throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }

    return amount;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  function volumeCreditsFor(perf) {
    let result = 0;
    result = result + Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if (playFor(perf).type === 'comedy') {
      result = result + Math.floor(perf.audience / 5);
    }
    return result;
  }

  function formatAsUSD(aNumber) {
    return new Intl.NumberFormat('en-US', {
      style:                 'currency',
      currency:              'USD',
      minimumFractionDigits: 2
    }).format(aNumber);
  }

  function totalVolumeCredits() {
    let volumeCredits = 0;
    for (const perf of invoice.performances) {
      volumeCredits = volumeCredits + volumeCreditsFor(perf);
    }
    return volumeCredits;
  }
  let totalAmount = 0;
  let result = `Statement for ${invoice.customer}\n`;

  for (const perf of invoice.performances) {
    // print line for this order
    result = `${result} ${playFor(perf).name}: ${formatAsUSD(amountFor(perf) / 100)} (${perf.audience} seats)\n`;
    totalAmount = totalAmount + amountFor(perf);
  }

  result = `${result}Amount owed is ${formatAsUSD(totalAmount / 100)}\n`;
  result = `${result}You earned ${totalVolumeCredits()} credits\n`;
  return result;
}

module.exports = {
  statement
};
