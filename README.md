# py_js_print_format

CIC Paul wanted to do Python like string formatting in JS.

So I had a crack at implementing it using a RegExp and some JS, based off the [Python docs](https://docs.python.org/3/library/string.html#formatspec).

I'm not intending on maintaining this, it's just a plaything. Only a couple of hours went into dev so it's not fully implemented or tested.

Implementing the mini-lang just convinced me that it's the wrong way to do things. Use proper string formatting libraries that specialise in particular formats!

```javascript
const print = require('./main.js');

// set this if you want to see the regex state
//print.debug = true;
print`
  align left   |${`left: <20`}|
  align right  |${`right: >20`}|
  align middle |${`middle: ^20`}|
  align signed |${`+signed: =20`}|
  decimal      |${'255:d'}|
  binary       |${'255:b'}|
  octal        |${'255:o'}|
  hex lower    |${'255:x'}|
  hex upper    |${'255:X'}|
  x binary     |${'255:#b'}|
  x octal      |${'255:#o'}|
  x hex lower  |${'255:#x'}|
  x hex upper  |${'255:#X'}|
  unicode      |${'8205:c'}${'10084:c'}${'65039:c'}${'8205:c'}|
  precision 3  |${Math.PI+':.3'}|
  sci lower    |${Math.PI*10000000+':e'}|
  sci upper    |${Math.PI*10000000+':E'}|
  sci prec3    |${Math.PI*10000000+':.3e'}|
  sci prec12   |${Math.PI*10000000+':.12e'}|
  fixed prec3  |${Math.PI*10000000+':.3f'}|
  locale       |${Math.PI*10000000+':n'}|
  string (def) |${Math.PI*10000000+':s'}|
  percent      |${'0.1234567:%'}|
  grouping _   |${'1234567:_'}|
  grouping ,   |${'1234567:,'}|
  mixed 1      |${Math.PI*10000000+': =+20,.3'}|
  mixed 2      |${'1234567: =+20,.3'}|
  zeros left   |${'-123.456789:<+020'}|
  zeros right  |${'-123.456789:>+020'}|
  zeros middle |${'-123.456789:^+020'}|
  zeros def    |${'-123.456789:=+020'}|
`;
/* outputs
  align left   |left                |
  align right  |               right|
  align middle |       middle       |
  align signed |+             signed|
  decimal      |255|
  binary       |11111111|
  octal        |377|
  hex lower    |ff|
  hex upper    |FF|
  x binary     |0b11111111|
  x octal      |0o377|
  x hex lower  |0xff|
  x hex upper  |0XFF|
  unicode      |‍❤️‍|
  precision 3  |3.142|
  sci lower    |3.141593e+7|
  sci upper    |3.141593E+7|
  sci prec3    |3.142e+7|
  sci prec12   |3.141592653590e+7|
  fixed prec3  |31415926.536|
  locale       |31,415,926.536|
  string (def) |31415926.535897933|
  percent      |12.345670%|
  grouping _   |1_234_567|
  grouping ,   |1,234,567|
  mixed 1      |+     31,415,926.536|
  mixed 2      |+          1,234,567|
  zeros left   |-123.456789000000000|
  zeros right  |-000000000123.456789|
  zeros middle |-00000123.4567890000|
  zeros def    |-000000000123.456789|
*/
```
