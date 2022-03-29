const invoice = require('../../service/statement/invoinces.json');
const plays = require('../../service/statement/plays.json');
const statement = require('../../service/statement/statement.v0');

const result = 'Statement for BigCo\n '
                + 'Hamlet: $650.00 (55 seats)\n '
                + 'As You Like It: $580.00 (35 seats)\n '
                + 'Othello: $500.00 (40 seats)\n'
                + 'Amount owed is $1,730.00\nYou earned 47 credits\n';
test('adds 1 + 2 to equal 3', () => {
  expect(statement.statement(invoice, plays)).toBe(result);
});
