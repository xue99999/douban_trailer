const Koa = require('koa')
const mongoose = require('mongoose')
const app = new Koa()
const {connect, initScheme} = require('./database/init')

;(async () => {
    await connect()

    await initScheme()

    const Movie = mongoose.model('Movie')
    const movies = await Movie.find({})

    console.log(movies)
})()

app.use(async (ctx, next) => {
    ctx.body = 'haggh' 
})

app.listen(3000)