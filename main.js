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
const regex = new RegExp([
  '^((?<fill>.)?(?<align>[<>=^]))?',
  '(?<sign>[+\\- ]?)',
  '(?<alt>#?)',
  '(?<zeropad>0?)',
  '(?<width>[0-9]*)',
  '(?<grouping>[_,]?)',
  '(\\.(?<precision>[0-9]*))?',
  '(?<type>[bcdeEfFgGnosxX%]?)$',
].join(''));

function format(str='') {
  if (typeof str !== 'string') return str + '';
  const [static,command] = str.split(':'); if (!command) return static;  
  const results = regex.exec(command);     if (!results) return console.error('bad formatting argument', command);
  const onumber = Number.parseFloat(static);
  if (print.debug) console.log(static, command, JSON.stringify(results.groups,null,2));
  let output = static;

  if (Number.isNaN(onumber) === false) {
    let number = Math.abs(onumber);
    let precision = Number.parseInt(results.groups.precision);
    let alt = results.groups.alt == '#';
    if (Number.isNaN(precision))  precision = 6;
    if (Number.isInteger(number)) precision = 0;

    // handle formatting
    switch(results.groups.type) {
      case 'b': output = (alt?'0b':'')+number.toString(2); break; // binary 
      case 'c': output = String.fromCharCode(number); break; // unicode character
      case 'd': output = number.toString(10); break; // decimal
      case 'e': output = Number.parseFloat(number).toExponential(precision).toLowerCase(); break; // scientific notation, lower case
      case 'E': output = Number.parseFloat(number).toExponential(precision).toUpperCase(); break; // scientific notation, upper case
      case 'f': output = number.toFixed(precision); break;
      case 'F': output = number.toFixed(precision); break;
      case 'g': output = number.toFixed(precision); break;
      case 'G': output = number.toFixed(precision); break;
      case 'n': output = new Intl.NumberFormat().format(number); break; // locale number format
      case 'o': output = (alt?'0o':'')+number.toString(8); break; // octal
      case 's': output = static; break; // string (default)
      case 'x': output = (alt?'0x':'')+number.toString(16).toLowerCase(); break; // hexadecimal lower case
      case 'X': output = (alt?'0X':'')+number.toString(16).toUpperCase(); break; // hexadecimal upper case
      case '%': output = (100 * number).toFixed(precision) + '%'; break;
      default:  output = number.toFixed(precision); break; // string
    }

    // handle grouping
    let [pre,post] = output.split('.');
    switch(results.groups.grouping) {
      case ',': pre = new Intl.NumberFormat('en').format(pre); break;
      case '_': pre = new Intl.NumberFormat('en').format(pre).split(',').join('_'); break;
      default : break;
    }
    output = pre + (post ? '.'+post : '');

    // handle the sign-formatting of the number
    let sign = '';
    switch(results.groups.sign) {
      case '+': sign = onumber==0 ? ' ' : onumber>0 ? '+' : '-'; break;
      case '-': sign = onumber==0 ?  '' : onumber>0 ?  '' : '-'; break;
      case ' ': sign = onumber==0 ? ' ' : onumber>0 ? ' ' : '-'; break;
      default : sign = onumber==0 ?  '' : onumber>0 ?  '' : '-'; break;
    }
    output = sign + output;
  }

  // handle alignment
  let min_width = Number.parseInt(results.groups.width);
  if (Number.isNaN(min_width)) min_width = 0;

  if (output.length < min_width) {
    let diff   = min_width - output.length;
    let chr    = results.groups.fill || ' ';
    let sign   = output[0];
    let signed = sign == ' ' || sign == '-' || sign == '+';
    let zpad   = results.groups.zeropad == '0';
    if (zpad && signed) {
      switch(results.groups.align) {
        case '<': output = output + '0'.repeat(diff); break; // left
        case '>': output = sign   + '0'.repeat(diff) + output.slice(1); break; // right
        case '^': output = sign   + '0'.repeat(Math.ceil(diff/2)) + output.slice(1) + '0'.repeat(Math.floor(diff/2)); break; // center
        case '=': output = sign   + '0'.repeat(diff) + output.slice(1); break; // right, sign left
        default : break; 
      }
    }
    else {
      switch(results.groups.align) {
        case '<': output = output + chr.repeat(diff); break; // left
        case '>': output = chr.repeat(diff) + output; break; // right
        case '^': output = chr.repeat(Math.ceil(diff/2)) + output + chr.repeat(Math.floor(diff/2)); break; // center
        case '=': output = signed ? sign+chr.repeat(diff)+output.slice(1) : chr.repeat(diff)+output; break; // right, sign left
        default : break; 
      }
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
}
