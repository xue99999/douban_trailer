const cp = require('child_process')
const {resolve} = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')


;(async () => {
    const script = resolve(__dirname, '../crawler/trailer-list')
    const child = cp.fork(script)
    let invoked = false
    
    child.on('error', err => {
        if (invoked) return

        invoked = true

        console.log(err)
    })

    child.on('exit', code => {
        if (invoked) return

        invoked = false

        let err = code === 0 ? null : new Error('exit code ' + code)
        console.log(err)
    })
    
    child.on('message', data => {
        const {result} = data

        // 先判断数据库中有没有这条数据,没有的话,把每一条数据都存入数据库
        result.forEach(async item => {
            let movie = await Movie.findOne({
                doubanId: item.doubanId
            })

            if (!movie) {
                movie = new Movie(item)
                await movie.save()
            }
        })
    })
})()