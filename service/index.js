const Koa = require('koa')
const app = new Koa()
const {connect} = require('./database/init')

;(async () => {
    await connect()
})()

app.use(async (ctx, next) => {
    ctx.body = 'haggh' 
})

app.listen(3000)