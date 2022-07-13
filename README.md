# py_js_print_format

CIC Paul wanted to do Python like string formatting in JS.

So I had a crack at implementing it using a RegExp and some JS, based off the [Python docs](https://docs.python.org/3/library/string.html#formatspec).

I'm not intending on maintaining this, it's just a plaything. Only a couple of hours went into dev so it's not fully implemented or tested.

Implementing the mini-lang just convinced me that it's the wrong way to do things. Use proper string formatting libraries that specialise in particular formats!

```javascript
const print = require('./main.js');

// set this if you want to see the regex state
//print.debug = true;
print`align left   |${`left: <20`}|`;
print`align right  |${`right: >20`}|`;
print`align middle |${`middle: ^20`}|`;
print`align signed |${`+signed: =20`}|`;
print`binary       |${'255:b'}|`;
print`decimal      |${'255:d'}|`;
print`octal        |${'255:o'}|`;
print`hex lower    |${'255:x'}|`;
print`hex upper    |${'255:X'}|`;
print`unicode      |${'8205:c'}${'10084:c'}${'65039:c'}${'8205:c'}|`;
print`precision 3  |${Math.PI+':.3'}|`;
print`sci lower    |${Math.PI*10000000+':e'}|`;
print`sci upper    |${Math.PI*10000000+':E'}|`;
print`sci prec3    |${Math.PI*10000000+':.3e'}|`;
print`sci prec12   |${Math.PI*10000000+':.12e'}|`;
print`fixed prec3  |${Math.PI*10000000+':.3f'}|`;
print`locale       |${Math.PI*10000000+':n'}|`;
print`string (def) |${Math.PI*10000000+':s'}|`;
print`percent      |${'0.1234567:%'}|`;
print`grouping _   |${'1234567:_'}|`;
print`grouping ,   |${'1234567:,'}|`;
print`mixed 1      |${Math.PI*10000000+': =+20,.3'}|`;
print`mixed 2      |${'1234567: =+20,.3'}|`;

/* outputs
align left   |left                |
align right  |               right|
align middle |       middle       |
align signed |+             signed|
binary       |11111111|
decimal      |255|
octal        |377|
hex lower    |ff|
hex upper    |FF|
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
*/
```
