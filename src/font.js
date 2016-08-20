const debug = require('debug')('markx')

const font = function(line) {
  debug('font: ' + line)
    // must be less than 50% of the line
    // no leading or trailing spaces
  line = line
    .replace(/\*([^ \*][^\*]*[^ \*])\*/g, '<b>$1</b>')
    .replace(/~([^ \~][^\~]*[^ \~])~/g, '<s>$1</s>')
    .replace(/_([^ _][^_]*[^ _])_/g, '<u>$1</u>')

  // mark / hightlight
  // [text r] [text r!], color can be red, blue, green
  if (line.indexOf(']') !== -1) {
    line = line
      .replace(/\[([^\s\[\]][^\[\]]*[^\s\[\]]) r\]/g, '<em class="fc-red">$1</em>')
      .replace(/\[([^\s\[\]][^\[\]]*[^\s\[\]]) g\]/g, '<em class="fc-green">$1</em>')
      .replace(/\[([^\s\[\]][^\[\]]*[^\s\[\]]) b\]/g, '<em class="fc-blue">$1</em>')
    if (line.indexOf('!]') !== -1) {
      line = line
        .replace(/\[([^\s\[\]][^\[\]]*[^\s\[\]]) r!\]/g, '<em class="bc-red">$1</em>')
        .replace(/\[([^\s\[\]][^\[\]]*[^\s\[\]]) g!\]/g, '<em class="bc-green">$1</em>')
        .replace(/\[([^\s\[\]][^\[\]]*[^\s\[\]]) b!\]/g, '<em class="bc-blue">$1</em>')
    }
  }

  return line
}

module.exports = font
