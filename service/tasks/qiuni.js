const nanoid = require('nanoid')
const qiniu = require('qiniu')
const config = require('../config')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

const uploadToQiniu = async(url, key) => {
    return new Promise((resolve, reject) => {
        client.fetch(url, bucket, key, (err, ret, info) => {
            if (err) {
                reject(err)
            } else {
                if (info.statusCode === 200) {
                    resolve({key})
                } else {
                    reject(info)
                }
            }
        })
    })
}

;(async () => {
    let movies = [{
        doubanId: 27024903,
        poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2501863104.jpg',
        video: 'http://vt1.doubanio.com/201907131723/aa67e790172a05cf1a84781f4f8ecef6/view/movie/M/302220137.mp4',
        cover: 'https://img1.doubanio.com/img/trailer/medium/2500490757.jpg',
    }]

    movies.forEach(async movie => {
        if (movie.video && !movie.key) {
            try {
                console.log('正在上传。。。')
                let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')
                let posterData = await uploadToQiniu(movie.poster, nanoid() + '.jpg')
                let coverData = await uploadToQiniu(movie.cover, nanoid() + '.jpg')

                if (videoData.key) {
                    movie.videoKey = videoData.key
                }
                if (posterData.key) {
                    movie.posterKey = posterData.key
                }
                if (coverData.key) {
                    movie.coverKey = coverData.key
                }

                console.log(movie)
            } catch(err) {
                console.log(err)
            }
        }
    })
})()
