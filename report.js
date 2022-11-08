function printReport(pages) {
    console.log('Report it starting...')
    const counts = Object.keys(pages).map(
        (key) => {return [key, pages[key]]}
    )
    counts.sort(
        (first, second) => { return second[1] - first[1]}
    )

    const keys = counts.map(
        (e) => { return e[0] }
    )
    
    for (let i = 0; i < keys.length - 1; i++) {
        console.log(`found ${counts[i][1]} internal links to ${keys[i]}`)
    }
}

module.exports = {
    printReport
}