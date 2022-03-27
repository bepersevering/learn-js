const invoice = require('../../service/invoinces.json');
const plays = require('../../service/plays.json');
const statement_v0 = require('../../service/statement_v0');


let result_v0 = 'Statement for BigCo\n ' 
                + 'Hamlet: $650.00 (55 seats)\n ' 
                + 'As You Like It: $580.00 (35 seats)\n ' 
                + 'Othello: $500.00 (40 seats)\n' 
                + 'Amount owed is $1,730.00\nYou earned 47 credits\n';
test_v0('adds 1 + 2 to equal 3', () => {
  expect(statement_v0.statement(invoice, plays)).toBe(result_v0);
});