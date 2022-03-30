const {ComedyCalculator} = require('./calculator/ComedyCalculator');
const {TragedyCalculator} = require('./calculator/TragedyCalculator');


function createPerformanceCalculator(aPerformance, aPlay) {
  console.log(`aPerformance = ${JSON.stringify(aPerformance)}`);
  console.log(`aPlay = ${JSON.stringify(aPlay)}`);
  switch (aPlay.type) {
  case 'tragedy':
    return new TragedyCalculator(aPerformance, aPlay);
  case 'comedy':
    return new ComedyCalculator(aPerformance, aPlay);
  default:
    throw new Error(`unknown type: ${aPlay.type}`);
  }
}

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
  return customerData;

  // 现在我只是简单地返回了一个aPerformance对象的副本， 但马上我就会往这
  // 条记录中添加新的数据。 返回副本的原因是， 我不想修改传给函数的参数， 我总
  // 是尽量保持数据不可变（immutable） ——可变的状态会很快变成烫手的山芋。
  function enrichPerformance(aPerformance) {
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance));
    const result = {};
    // 返回一个浅副本
    Object.assign(result, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumeCredits = calculator.volumeCredits;
    return result;
  }
  // {playID: 'hamlet', audience: 55}
  function playFor(aPerformance) {
    return plays[aPerformance.playID];
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
