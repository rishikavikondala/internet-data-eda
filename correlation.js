const Correlation = require('node-correlation');

var a = [1, 2, 3, 4, 5];
var b = [0, 6, 2, 10, 4];
 
console.log(Correlation.calc(a, b));