const {resolve} = require('path')
const Koa = require('koa')
const {connect, initScheme, initAdmin} = require('./database/init')

const R = require('ramda')
// const MIDDLEWARES = ['router', 'parcel']
const MIDDLEWARES = ['router']

const useMiddlewares = app => {
    R.map(
        R.compose(
            R.forEachObjIndexed(
                initRoute => initRoute(app)
            ),
            require,
            name => resolve(__dirname, `./middlewares/${name}`)
        )
    )(MIDDLEWARES)
}

;(async () => {
    await connect()

    initScheme()
    initAdmin()
    
    // require('./tasks/movie')
    // require('./tasks/trailer')
    // require('./tasks/qiniu')

    const app = new Koa()
    
    // app.use(views(resolve(__dirname, '../dist')), {
    //     extension: 'html'
    // })

    await useMiddlewares(app)
    app.listen(3000)

})()
