"use strict";

/**
 * 结算单
 * @param {*} invoice 
 * @param {*} plays 
 * @returns 
 */
function statement(invoice, plays) {
  var totalAmount = 0;
  var volumeCredits = 0;
  var result = "Statement for ".concat(invoice.customer, "\n");
  var format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2
  }).format;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = invoice.performances[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var perf = _step.value;
      var play = plays[perf.playID];
      var thisAmount = amountFor(perf, play); // add volume credits

      volumeCredits += Math.max(perf.audience - 30, 0); // add extra credit for every ten comedy attendees

      if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5); // print line for this order

      result += " ".concat(play.name, ": ").concat(format(thisAmount / 100), " (").concat(perf.audience, " seats)\n");
      totalAmount += thisAmount;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  result += "Amount owed is ".concat(format(totalAmount / 100), "\n");
  result += "You earned ".concat(volumeCredits, " credits\n");
  return result;
}

;

function amountFor(perf, play) {
  var thisAmout = 0;

  switch (play.type) {
    case "tragedy":
      thisAmout = 40000;

      if (perf.audience > 30) {
        thisAmout += 1000 * (perf.audience - 30);
      }

      break;

    case "comedy":
      thisAmout = 30000;

      if (perf.audience > 20) {
        thisAmout += 10000 + 500 * (perf.audience - 20);
      }

      thisAmout += 300 * perf.audience;
      break;

    default:
      throw new Error("unknown type: ".concat(play.type));
  }

  return thisAmout;
}

;
module.exports = {
  statement: statement
};