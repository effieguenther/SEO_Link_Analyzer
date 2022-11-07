const { normalizeURL } = require('./crawl.js')
const { getURLsFromHTML } = require('./crawl.js')
const { test, expect } = require('@jest/globals')

test('normalizeURL protocol', () => {
    const input = 'https://domain.com/path'
    const actual = normalizeURL(input)
    const expected = 'domain.com/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL slash', () => {
    const input = 'https://domain.com/path/'
    const actual = normalizeURL(input)
    const expected = 'domain.com/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL capitals', () => {
    const input = 'https://DOMAIN.com/path'
    const actual = normalizeURL(input)
    const expected = 'domain.com/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL http', () => {
    const input = 'http://DOMAIN.com/path'
    const actual = normalizeURL(input)
    const expected = 'domain.com/path'
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/path/one' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML both', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'https://blog.boot.dev/path/one', 'https://other.com/path/one' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML handle error', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ ]
    expect(actual).toEqual(expected)
  })
