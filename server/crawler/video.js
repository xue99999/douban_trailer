const puppeteer = require('puppeteer')

const base = 'https://movie.douban.com/subject/'


const sleep = time => new Promise(resolve => {
    setTimeout(resolve, time)
})


process.on('message', async movies => {
    console.log('开始访问目标视频网页。。。')
    const browser = await puppeteer.launch({
        // 可以找到Chromium标志的列表
        args: ['--no-sandbox']
    })

    for (let i=0; i<movies.length; i++) {
        let movie = movies[i]
        let {doubanId} = movie
        console.log('doubanId---', doubanId)
        const page = await browser.newPage()
    
        await page.goto(base + doubanId, {
            // 当至少500 ms内没有超过2个网络连接时，考虑完成导航
            waitUntil: 'networkidle2'
        })

        await sleep(1000)

        // page.evaluate(func) 要在页面上下文中求值的函数
        const result = await page.evaluate(() => {
            var $ = window.$
            const it = $('.related-pic-video')
    
            if (it && it.length > 0) {
                const link = it.attr('href')
                const cover_style = it.attr('style')
                const slice_start_idx = cover_style.indexOf('http')
                const cover = cover_style.slice(slice_start_idx, -2)
        
                return {
                    link,
                    cover,
                }
            }
        })
    
        let video

    
        if (result.link) {
            await page.goto(result.link, {
                // 当至少500 ms内没有超过2个网络连接时，考虑完成导航
                waitUntil: 'networkidle2'
            })
    
            await sleep(2000)
    
            video = await page.evaluate(() => {
                var $ = window.$
                const it = $('source')
    
                if (it && it.length > 0) {
                    return it.attr('src')
                }
                return ''
            })        
        }

        const data = {
            doubanId,
            video,
            cover: result.cover,
        }
        // 给子进程发送结果
        process.send(data)
    }

    
    browser.close()
    process.exit(0)
})