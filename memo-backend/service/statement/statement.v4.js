const {createStatementData} = require('./createStatementData');

const playsExample = {
  hamlet: {
    name: 'Hamlet',
    type: 'tragedy'
  },
  'as-like': {
    name: 'As You Like It',
    type: 'comedy'
  },
  othello: {
    name: 'Othello',
    type: 'tragedy'
  }
};

const invoincesData = {
  customer:     'BigCo',
  performances: [{
    playID:   'hamlet',
    audience: 55
  },
  {
    playID:   'as-like',
    audience: 35
  },
  {
    playID:   'othello',
    audience: 40
  }
  ]
};

/**
 * 构造文本形式结算单
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
 * @return {string} result - 构造文本形式结算单
 */
function statement(invoice, plays) {
  const customerData = createStatementData(invoice, plays);
  return renderPlainText(customerData);
}

function renderPlainText(customerData) {
  let result = `Statement for ${customerData.customer}\n`;

  for (const perf of customerData.performances) {
    // print line for this order
    result = `${result} ${perf.play.name}: ${formatAsUSD(perf.amount / 100)} (${perf.audience} seats)\n`;
  }

  result = `${result}Amount owed is ${formatAsUSD(customerData.totalAmount / 100)}\n`;
  result = `${result}You earned ${customerData.totalVolumeCredits} credits\n`;
  return result;
}


/**
 * 构造html形式结算单
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
 * @return {string} result - 构造html形式结算单
 */
function htmlStatement(invoice, plays) {
  const customerData = createStatementData(invoice, plays);
  return renderHtml(customerData);
}

function renderHtml(customerData) {
  let result = `<h1>Statement for ${customerData.customer}</h1>\n`;
  result = `${result}<table>\n`;
  result = `${result}<tr><th>play</th><th>seats</th><th>cost</th></tr>`;
  for (const perf of customerData.performances) {
    result = `${result} <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
    result = `${result}<td>${formatAsUSD(perf.amount)}</td></tr>\n`;
  }
  result = `${result}</table>\n`;
  result = `${result}<p>Amount owed is <em>${formatAsUSD(customerData.totalAmount)}</em></p>\n`;
  result = `${result}<p>You earned <em>${customerData.totalVolumeCredits}</em> credits</p>\n`;
  return result;
}

function formatAsUSD(aNumber) {
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: 2
  }).format(aNumber);
}

module.exports = {
  statement,
  htmlStatement
};
