/* eslint-disable no-restricted-syntax */
const {AbstractPerformanceCalculator} = require('./AbstractPerformanceCalculator');

class ComedyCalculator extends AbstractPerformanceCalculator {
  get amount() {
    let amount = 30000;
    if (this.performance.audience > 20) {
      amount = amount + (10000 + 500 * (this.performance.audience - 20));
    }
    amount = amount + 300 * this.performance.audience;
    return amount;
  }

  get volumeCredits() {
    return super.volumeCredits + Math.floor(this.performance.audience / 5);
  }
}

module.exports = {
  ComedyCalculator
};
