const mongoose = require('mongoose')
const glob = require('glob')
const {resolve} = require('path')
const db = 'mongodb://localhost/douban-demo'

mongoose.Promise = global.Promise

exports.connect = () => {
    let maxConnectTimes = 0

    return new Promise((resolve, reject) => {

        if (process.env.Node_ENV !== 'production') {
            mongoose.set('debug', true)
        }
    
        mongoose.connect(db)
    
        mongoose.connection.on('disconnected', () => {
            console.log('hahhahha')
            maxConnectTimes++
    
            if (maxConnectTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了，快去修吧')
            }
        })
    
        mongoose.connection.on('error', err => {
            console.log('xxxxxxxxxx')
            maxConnectTimes++
    
            if (maxConnectTimes < 5) {
                mongoose.connect(db)
            } else {
                throw new Error('数据库挂了，快去修吧')
            }
        })
    
        mongoose.connection.once('open', () => {
            resolve()
            console.log('MongoDB Connected successfully!')
        })
    })
}

exports.initScheme = () => {
    glob.sync(resolve(__dirname, './scheme', '**/*.js')).forEach(require)
}

exports.initAdmin = async () => {
    const User = mongoose.model('User')
    let user = await User.findOne({
        username: 'xuejun'
    })

    if (!user) {
        const user = new User({
            username: 'xuejun',
            email: 'koa2@imooc.com',
            password: '123abc'
        })

        await user.save()
    }
}