const { JSDOM } = require('jsdom')

async function crawlPage(baseURL, currentURL, pages) {
    const currentURLObj = new URL(currentURL)
    const baseURLObj = new URL(baseURL)
    if (currentURLObj.hostname !== baseURLObj.hostname){
        return pages
    }

    const normalCurrentURL = normalizeURL(currentURL)
    
    if (pages[normalCurrentURL] > 0){
        pages[normalCurrentURL]++
        return pages
    }

    pages[normalCurrentURL] = 1

    console.log(`crawling ${currentURL}`)
    let htmlBody = ''
    try {
        const response = await fetch(currentURL)
        if (response.status > 399){
            console.log(`Got HTTP error, status code: ${response.status}`)
            return pages
        }
        const contentType = response.headers.get('content-type')
        if (!contentType.includes('text/html')) {
            console.log(`Got non-html response: ${contentType}`)
            return pages
        }
        htmlBody = await response.text()
    } catch (err){
        console.log(err.message)
    }

    const htmlURLs = getURLsFromHTML(htmlBody, baseURL)
    for (const htmlURL of htmlURLs){
        pages = await crawlPage(baseURL, htmlURL, pages)
    }

    return pages
}

function normalizeURL(inputURL) {
    const urlObj = new URL(inputURL)
    let fullPath = `${urlObj.host}${urlObj.pathname}`
    if (fullPath.length > 0 && fullPath.slice(-1) === '/'){
        fullPath = fullPath.slice(0, -1)
    }
    return fullPath
}

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody)
    const aElements = dom.window.document.querySelectorAll('a')
    for (const aElement of aElements){
        if (aElement.href.slice(0,1) === '/'){
            try {
                urls.push(new URL(aElement.href, baseURL).href)
            } catch (err){
                console.log(`${err.message}: ${aElement.href}`)
            }
        } else {
            try {
                urls.push(new URL(aElement.href).href)
            } catch (err){
                console.log(`${err.message}: ${aElement.href}`)
            }
        }
    }
    return urls
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}