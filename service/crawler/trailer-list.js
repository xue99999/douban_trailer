const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/tag/#/?sort=U&range=7,10&tags='

const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})

;(async () => {
    console.log('Start visit the target page')

    const browser = await puppeteer.launch({
        // 可以找到Chromium标志的列表
        args: ['--no-sandbox']
    })

    const page = await browser.newPage()
    
    await page.goto(url, {
        // 当至少500 ms内没有超过2个网络连接时，考虑完成导航
        waitUntil: 'networkidle2'
    })

    await sleep(3000)

    await page.waitForSelector('.more')

    for(let i = 0; i < 5; i++) {
        await sleep(3000)
        await page.click('.more')
    }

    // page.evaluate(func) 要在页面上下文中求值的函数
    const result = await page.evaluate(() => {
        var $ = window.$
        var items = $('.list-wp .item')
        var links = []

        if (items.length > 1) {
            items.each((index, item) => {
                let it = $(item)
                let doubanId = it.find('div').data('id')
                let title = it.find('.title').text()
                let rate = Number(it.find('.rate').text())
                let poster = it.find('.pic>img').attr('src').replace('s_ratio_poster', 'l_ratio_poster')

                links.push({
                    doubanId,
                    title,
                    rate,
                    poster,
                })
            })
        }

        return links
    })

    browser.close()

    // 给子进程发送结果
    process.send({result})
    // 退出子进程
    process.exit(0)

})()