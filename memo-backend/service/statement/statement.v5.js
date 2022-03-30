const {createStatementData} = require('./createStatementData.v2');

/**
 * 支持更多类型的戏剧， 以及支持
 * 它们各自的价格计算和观众量积分计算。 对于现在的结构， 我只需要在计算函数
 * 里添加分支逻辑即可。 amountFor函数清楚地体现了， 戏剧类型在计算分支的选
 * 择上起着关键的作用——但这样的分支逻辑很容易随代码堆积而腐坏， 除非编程
 * 语言提供了更基础的编程语言元素来防止代码堆积。
 *
 * 先建立一个继承体系， 它有“喜剧”（comedy） 和“悲
    剧”（tragedy） 两个子类， 子类各自包含独立的计算逻辑。 调用者通过调用一个
    多态的amount函数， 让语言帮你分发到不同的子类的计算过程中。 volumeCredits
    函数的处理也是如法炮制。


 */


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
