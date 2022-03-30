/* eslint-disable no-restricted-syntax */
const {AbstractPerformanceCalculator} = require('./AbstractPerformanceCalculator');

class TragedyCalculator extends AbstractPerformanceCalculator {
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result = result + 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

module.exports = {
  TragedyCalculator
};

