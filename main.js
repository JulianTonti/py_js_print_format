/*
format_spec     ::=  [[fill]align][sign][#][0][width][grouping_option][.precision][type]
fill            ::=  <any character>
align           ::=  "<" | ">" | "=" | "^"
sign            ::=  "+" | "-" | " "
width           ::=  digit+
grouping_option ::=  "_" | ","
precision       ::=  digit+
type            ::=  "b" | "c" | "d" | "e" | "E" | "f" | "F" | "g" | "G" | "n" | "o" | "s" | "x" | "X" | "%"
*/
let rx = new RegExp([
  '^((?<fill>.)?',
  '(?<align>[<>=^]))?',
  '(?<sign>[+\\- ]?)',
  '(?<width>[0-9]*)',
  '(?<grouping>[_,]?)',
  '(\\.(?<precision>[0-9]*))?',
  '(?<type>[bcdeEfFgGnosxX%]?)$',
].join(''));

function format(s) {
  if (typeof s !== 'string') {
    return s + '';
  }
  const [static,command] = s.split(':');
  if (!command) {
    return static;  
  }
  const r = rx.exec(command);
  if (!r) {
    return console.error('bad formatting argument', command);
  }
  if (print.debug) console.log(static, command, JSON.stringify(r.groups,null,2));
  const n = Number.parseFloat(static);
  let output = static;

  if (Number.isNaN(n) === false) {
    let number = Math.abs(n);
    let precision = Number.parseInt(r.groups.precision);
    if (Number.isNaN(precision))  precision = 6;
    if (Number.isInteger(number)) precision = 0;

    // handle formatting
    switch(r.groups.type) {
      case 'b': output = number.toString(2); break; // binary 
      case 'c': output = String.fromCharCode(number); break; // unicode character
      case 'd': output = number.toString(10); break; // decimal
      case 'e': output = Number.parseFloat(number).toExponential(precision).toLowerCase(); break; // scientific notation, lower case
      case 'E': output = Number.parseFloat(number).toExponential(precision).toUpperCase(); break; // scientific notation, upper case
      case 'f': output = number.toFixed(precision); break;
      case 'F': output = number.toFixed(precision); break;
      case 'g': output = number.toFixed(precision); break;
      case 'G': output = number.toFixed(precision); break;
      case 'n': output = new Intl.NumberFormat().format(number); break; // locale number format
      case 'o': output = number.toString(8); break; // octal
      case 's': output = static; break; // string (default)
      case 'x': output = number.toString(16).toLowerCase(); break; // hexadecimal lower case
      case 'X': output = number.toString(16).toUpperCase(); break; // hexadecimal upper case
      case '%': output = (100 * number).toFixed(precision) + '%'; break;
      default:  output = number.toFixed(precision); break; // string
    }

    // handle grouping
    let [pre,post] = output.split('.');
    switch(r.groups.grouping) {
      case ',': pre = new Intl.NumberFormat('en').format(pre); break;
      case '_': pre = new Intl.NumberFormat('en').format(pre).split(',').join('_'); break;
      default : break;
    }
    output = pre + (post ? '.'+post : '');

    // handle the sign-formatting of the number
    let sign = '';
    switch(r.groups.sign) {
      case '+': sign = n == 0 ? ' ' : n > 0 ? '+' : '-'; break;
      case '-': sign = n == 0 ?  '' : n > 0 ?  '' : '-'; break;
      case ' ': sign = n == 0 ? ' ' : n > 0 ? ' ' : '-'; break;
      default : sign = n == 0 ?  '' : n > 0 ?  '' : '-'; break;
    }
    output = sign + output;
  }

  // handle alignment
  let min_width = Number.parseInt(r.groups.width);
  if (Number.isNaN(min_width)) min_width = 0;

  if (output.length < min_width) {
    let diff = min_width - output.length;
    let chr = r.groups.fill || ' ';
    switch(r.groups.align) {
      case '<': output = output + chr.repeat(diff); break; // left
      case '>': output = chr.repeat(diff) + output; break; // right
      case '^': output = chr.repeat(Math.ceil(diff/2)) + output + chr.repeat(Math.floor(diff/2)); break; // center
      case '=': output = (output[0] == ' ' || output[0] == '-' || output[0] == '+' 
        ? (output[0] ?? '') + chr.repeat(diff) + output.slice(1) 
        : chr.repeat(diff) + output
       ); break; // right with sign on the left
      default : break; 
    }
  }
  return output;
}
function print(statics,...dynamics) {
  dynamics.forEach((v,i) => dynamics[i] = statics[i] + format(v));
  console.log(dynamics.join('') + statics[statics.length-1]);
}
module.exports = print;

if (require.main === module) {
  /*
  format_spec     ::=  [[fill]align][sign][#][0][width][grouping_option][.precision][type]
  fill            ::=  <any character>
  align           ::=  "<" | ">" | "=" | "^"
  sign            ::=  "+" | "-" | " "
  width           ::=  digit+
  grouping_option ::=  "_" | ","
  precision       ::=  digit+
  type            ::=  "b" | "c" | "d" | "e" | "E" | "f" | "F" | "g" | "G" | "n" | "o" | "s" | "x" | "X" | "%"
  */
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
}
