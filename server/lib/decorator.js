const Router = require('koa-router')
const {resolve} = require('path')
const _ = require('lodash')
const glob = require('glob')
const R = require('ramda')

const symbolPrefix = Symbol('prefix')
const routerMap = new Map()
const isArray = c => _.isArray(c) ? c : [c]

export class Route {
    constructor(app, apiPath) {
        this.app = app
        this.apiPath = apiPath
        this.router = new Router()
    }

    init() {
        glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)

        for (let [conf, controller] of routerMap) {
            const controllers = isArray(controller)
            const prefixPath = conf.target[symbolPrefix]
            if (prefixPath) prefixPath = normalizePath(prefixPath)
            const routerPath = prefixPath + conf.path
            this.router[conf.method](routerPath, ...controllers)
        }

        this.app.use(this.router.routes())
        this.app.use(this.router.allowedMethods())
    }
}


const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const router = conf => (target, key, descriptor) => {
    conf.path = normalizePath(conf.path)

    routerMap.set({
        target,
        ...conf
    }, target[key])
    // target[key] => movieController下面的getMovies方法
    // 每条路由生成的结果
    // { target: [movieController], path: '/', method: 'get' } => [Function: getMovies]
}

export const controller = path => target => (target.prototype[symbolPrefix] = path)

export const get = path => router({
    path,
    method: 'get',
})
export const post = path => router({
    path,
    method: 'post',
})
export const put = path => router({
    path,
    method: 'put',
})
export const del = path => router({
    path,
    method: 'del',
})
export const use = path => router({
    path,
    method: 'use',
})

// routerMap 长这个样子
// Map {
//     { target: [movieController], path: '/', method: 'get' } => [Function: getMovies],
//     { target: [movieController], path: '/:id', method: 'get' } => [Function: getMovieDetail],
//     { target: [userController], path: '/', method: 'post' } => [Function: checkPassword],
//     { target: [userController], path: '/login', method: 'post' } => [Function: login] 
// }