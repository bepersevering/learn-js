/* eslint-disable no-restricted-syntax */
class AbstractPerformanceCalculator {
  constructor(aPerformance, aPlay) {
    this.performance = aPerformance;
    this.play = aPlay;
  }

  get amount() {
    throw new this.Error('subclass responsibility');
  }

  get volumeCredits() {
    return Math.max(this.performance.audience - 30, 0);
  }
}

module.exports = {
  AbstractPerformanceCalculator
};

