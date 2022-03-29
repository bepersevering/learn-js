/**
 * 结算单
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
   * @param {Object} play - play
   * @param {string} play.name - play name
   * @param {string} play.type - play type
   * @return {Number} amount
   */
  function amountFor(aPerformance, play) {
    let amount = 0;
    switch (play.type) {
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
      throw new Error(`unknown type: ${play.type}`);
    }

    return amount;
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const {format} = new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 2
  });

  for (const perf of invoice.performances) {
    const play = playFor(perf);
    const thisAmount = amountFor(perf, play);

    // add volume credits
    volumeCredits = volumeCredits + Math.max(perf.audience - 30, 0);
    // add extra credit for every ten comedy attendees
    if (play.type === 'comedy') { volumeCredits = volumeCredits + Math.floor(perf.audience / 5); }
    // print line for this order
    result = `${result} ${play.name}: ${format(thisAmount / 100)} (${perf.audience} seats)\n`;
    totalAmount = totalAmount + thisAmount;
  }
  result = `${result}Amount owed is ${format(totalAmount / 100)}\n`;
  result = `${result}You earned ${volumeCredits} credits\n`;
  return result;
}

module.exports = {
  statement
};
