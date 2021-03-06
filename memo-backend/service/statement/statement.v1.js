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
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const {format} = new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 2
  });

  for (const perf of invoice.performances) {
    const play = plays[perf.playID];
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

/**
 * calculate performance for play
 * @param {Object} perf - a performance
 * @param {string} perf.playID - invoice performances playID
 * @param {string} perf.audience - invoice performances audience
 * @param {Object} play - play
 * @param {string} play.name - play name
 * @param {string} play.type - play type
 * @return {Number} amount
 */
function amountFor(perf, play) {
  let thisAmout = 0;
  switch (play.type) {
  case 'tragedy':
    thisAmout = 40000;
    if (perf.audience > 30) {
      thisAmout = thisAmout + 1000 * (perf.audience - 30);
    }
    break;
  case 'comedy':
    thisAmout = 30000;
    if (perf.audience > 20) {
      thisAmout = thisAmout + (10000 + 500 * (perf.audience - 20));
    }
    thisAmout = thisAmout + 300 * perf.audience;
    break;
  default:
    throw new Error(`unknown type: ${play.type}`);
  }

  return thisAmout;
}

module.exports = {
  statement
};
