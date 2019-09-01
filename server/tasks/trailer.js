const cp = require('child_process')
const {resolve} = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

;(async () => {
    const script = resolve(__dirname, '../crawler/video')
    const child = cp.fork(script)
    let invoked = false

    // 查询没有video的电影
    let movies = await Movie.find({
        $or: [
            {video: { $exists: false }},
            {video: null}
        ]
    })

    // 将查找到的满足条件的movies,先发送给子进程
    child.send(movies)
    
    //错误的处理
    child.on('error', err => {
        if (invoked) return

        invoked = true

        console.log(err)
    })

    //子进程退出返回码
    child.on('exit', code => {
        if (invoked) return

        invoked = false

        let err = code === 0 ? null : new Error('exit code ' + code)
        console.log(err)
    })
    
    child.on('message', async data => {
        console.log(data)
        let {doubanId} = data
        let movie = await Movie.findOne({
            doubanId,
        })

        console.log('movie--', movie)

        if (data.video) {
            movie.video = data.video
            movie.cover = data.cover

            await movie.save()
        } else {
            await movie.remove()

            // let {movieTypes} = movie

            // movieTypes.forEach(type => {
            //     let cat = Category.findOne({
            //         name: type
            //     })
            // })

            // if (cat && cat.movies) {
            //     let idx = cat.movies.indexOf(movie._id)

            //     if (idx > -1) {
            //         cat.movies = cat.movies.splice(idx, 1)
            //     }

            //     await cat.save()
            // }
        }
    })

})()