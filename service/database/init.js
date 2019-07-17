const mongoose = require('mongoose')
const glob = require('glob')
const {resolve} = require('path')
const db = 'mongodb://localhost/douban-trailer'

mongoose.Promise = global.Promise

exports.initScheme = () => {
    glob.sync(resolve(__dirname, './scheme', '**/*.js')).forEach(require)
}

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
            const Dog = mongoose.model('Dog', {name: String})
            const doga = new Dog({name: '阿尔法'})

            doga.save().then(() => {
                console.log('wang')
            })

            resolve()
            console.log('MongoDB Connected successfully!')
        })
    })
}