const expect = require('chai').expect
const processText = require('../processText.js')

describe('process text', () => {
  it('plain text paragraph', () => {
    let input = `text text
text text`
    let output = '<p>text text<br>text text</p>'

    expect(processText(input)).to.be.equal(output)
  })

  it('with header', () => {
    let input = `# header 1
text text
# header 2
text text`
    let output = '<h1>header 1</h1>' +
      '<p>text text</p>' +
      '<h1>header 2</h1>' +
      '<p>text text</p>'

    expect(processText(input)).to.be.equal(output)
  })

  it('paragraph with empty lines', () => {
    let input = `text text

text text`
    let output = '<p>text text</p><p>text text</p>'

    expect(processText(input)).to.be.equal(output)
  })

  it('paragraph with quote', () => {
    let input = `text text
> quote 1
> quote 2
text text`
    let output = '<p>text text</p>' +
      '<blockquote>quote 1<br>quote 2</blockquote>' +
      '<p>text text</p>'

    expect(processText(input)).to.be.equal(output)
  })

  it('quote with header and styled font', () => {
    let input = `text text
> # header 1
> quote *bold*
text text`
    let output = '<p>text text</p>' +
      '<blockquote><h1>header 1</h1><p>quote <b>bold</b></p></blockquote>' +
      '<p>text text</p>'

    expect(processText(input)).to.be.equal(output)
  })

  it('paragraph with list', () => {
    let input = `text text
1. item 1
2. item 2
> text text
- item 3
- item 4`
    let output = '<p>text text</p>' +
      '<ol><li>item 1</li><li>item 2</li></ol>' +
      '<blockquote>text text</blockquote>' +
      '<ul><li>item 3</li><li>item 4</li></ul>'

    expect(processText(input)).to.be.equal(output)
  })

  it('list with styled font and mutiple line items', () => {
    let input = `text text
1. item 1
   item 1 _underline_
2. item 2
> text text
- item 3
- item 4`
    let output = '<p>text text</p>' +
      '<ol><li>item 1<br>item 1 <u>underline</u></li><li>item 2</li></ol>' +
      '<blockquote>text text</blockquote>' +
      '<ul><li>item 3</li><li>item 4</li></ul>'

    expect(processText(input)).to.be.equal(output)
  })

  it('quote with list', () => {
    let input = `text text
> text text
> 1. item 1
>    item 1 _underline_
> - item 3
> - item 4`
    let output = '<p>text text</p><blockquote><p>text text</p>' +
      '<ol><li>item 1<br>item 1 <u>underline</u></li></ol>' +
      '<ul><li>item 3</li><li>item 4</li></ul></blockquote>'

    expect(processText(input)).to.be.equal(output)
  })

  it('list with quote', () => {
    let input = `text text
1. item 1
   > quote 1
   > quote 2 *bold*
   item 1 _underline_
2. item 2
- item 3
  > quote 3
- item 4`
    let output = '<p>text text</p>' +
      '<ol><li><p>item 1</p><blockquote>quote 1<br>quote 2 <b>bold</b></blockquote>' +
      '<p>item 1 <u>underline</u></p></li><li>item 2</li></ol>' +
      '<ul><li><p>item 3</p><blockquote>quote 3</blockquote></li><li>item 4</li></ul>'

    expect(processText(input)).to.be.equal(output)
  })

  it('list with sublist', () => {
    let input = `text text
1. item 1
   - item 11
     item 11 _underline_
   item 1 *bold*
2. item 2
   1. item 21
- item 3
  1. item 31
- item 4
  - item 41`
    let output = '<p>text text</p>' +
      '<ol><li><p>item 1</p><ul><li>item 11<br>item 11 <u>underline</u></li></ul>' +
      '<p>item 1 <b>bold</b></p></li>' +
      '<li>item 2<ol><li>item 21</li></ol></li></ol>' +
      '<ul><li>item 3<ol><li>item 31</li></ol></li>' +
      '<li>item 4<ul><li>item 41</li></ul></li></ul>'

    expect(processText(input)).to.be.equal(output)
  })

})