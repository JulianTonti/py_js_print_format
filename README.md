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
print`binary       |${255+':b'}|`;
print`decimal      |${255+':d'}|`;
print`octal        |${255+':o'}|`;
print`hex lower    |${255+':x'}|`;
print`hex upper    |${255+':X'}|`;
print`unicode      |${ 8205+': c'}${10084+': c'}${65039+': c'}${ 8205+': c'}|`;
print`precision 3  |${Math.PI + ':.3'}|`;
print`sci lower    |${(Math.PI * 10000000) + ':e'}|`;
print`sci upper    |${(Math.PI * 10000000) + ':E'}|`;
print`sci prec3    |${(Math.PI * 10000000) + ':.3e'}|`;
print`sci prec6    |${(Math.PI * 10000000) + ':.6e'}|`;
print`fixed prec3  |${(Math.PI * 10000000) + ':.3f'}|`;
print`locale       |${(Math.PI * 10000000) + ':n'}|`;
print`string (def) |${(Math.PI * 10000000) + ':s'}|`;
print`percent      |${0.1234567 + ':%'}|`;
print`grouping _   |${(Math.PI * 10000000) + ':_'}|`;
print`grouping ,   |${(Math.PI * 10000000) + ':,'}|`;
print`mixed 1      |${(Math.PI * 10000000) + ': =+20,.3'}|`;
print`mixed 2      |${1234567 + ': =+20,.3'}|`;
```
