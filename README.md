# 豆瓣电影预告片网站

## 中间遇到的问题
- puppeteer npm安装不上：通过cnpm安装
- 项目如何支持装饰器(@controller('api/xxx'))的用法
- 项目如何支持postcss(写postcss.config.js配置文件即可)
- parcel 的dev和prod模式有何区别？
    dev模式提供了动态编译功能, prod提供了静态文件访问能力
- 'NODE_ENV' 不是内部或外部命令，也不是可运行的程序或批处理文件。
    拆分成2条来写
    set NODE_ENV=development && nodemon ./start.js
- DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead

## 需要看的知识点
### 进程的9个问题
- 什么是同步异步
- 什么是异步IO
- 什么是阻塞非阻塞
- 什么是事件循环与事件驱动  
- 什么是单线程
- 什么是进程
- 什么是子进程
- 怎样启动子进程
- 进程间如何通信



## 参考资料
- [Puppeteer APIv1.11 中文版](https://yq.aliyun.com/articles/607102)
- [Parcel 官网](https://zh.parceljs.org/getting_started.html)
- [Parcel Bundler](https://zh.parceljs.org/api.html#bundler)
- [win10上NODE_ENV报错的解决办法](https://www.jianshu.com/p/d0ea266c8e14)