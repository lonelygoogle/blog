
const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')
const { set,get } = require('./src/db/redis')

// session 数据
// const SESSION_DATA = {}
// 用于处理post data
const getPostData = (req) => {
    const promise = new Promise((resolve,reject) => {
        if (req.method !== 'POST') {
            resolve({})
            return
        }
        let postData = ''
        req.on('data', (chunk) => {
            postData += chunk.toString()
        })
        req.on('end', () => {
            if(!postData) {
                resolve({})
                return
            }    
            resolve(JSON.parse(postData))
        })
    })
    return promise
}

const serverHandle = (req,res)=> {
    res.setHeader('Content-type', 'application/json')

    // 获取path
    const url = req.url
    req.path = url.split('?')[0];

    //解析query
    req.query = querystring.parse(url.split('?')[1])

    //解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
        if (!item) {
            return
        }
        const arr = item.split('=')
        const key = arr[0]
        const value = arr[1]
        req.cookie[key] = value
        console.log(key, value)
    });
    // //解析session
    // let needSetCookie = false
    // let userId = req.cookie.userId
    // if (userId) {
    //     if (!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     } 
    // } else {
    //     needSetCookie = true
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    //解析session(使用redis)
    let needSetCookie = false
    let userId = req.cookie.userId
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化redis中的session值
        set(userId, {})
    }
    //获取session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        if (sessionData == null ) {
            set(req.sessionId,{})
            // 设置session
            req.session = {}
        } else {
            // 设置session
            req.session = sessionData
        }
        console.log('req.session', req.session)
        // 处理post Data 
        return getPostData(req)
    }).then(postData => {
        req.body = postData

        // 处理blog路由
        const blogResult = handleBlogRouter(req,res)
        if (blogResult) {
            blogResult.then((blogData) => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie',`userId=${userId}; path='/'; httpOnly`)
                }
                res.end(JSON.stringify(blogData))
            })
            return
        }

        // 处理user路由

        const userResult = handleUserRouter(req,res)
        if (userResult) {
            userResult.then((userData) =>{
                if (needSetCookie) {
                    res.setHeader('Set-Cookie',`userId=${userId}; path='/'; httpOnly`)
                }
                res.end(JSON.stringify(userData))
            })
            return
        }

        // 未命中
        res.writeHead(404, {'Content-type':'text/plain'})
        res.write('wall 404 not found /n')
        res.end()
    })



    // const resData = {
    //     env: process.env.NODE_DEV,
    //     name: '黄思沁150',
    //     site: 'imooc'
    // }
    // res.end(JSON.stringify(resData))
    // console.log(process.env.NODE_DEV)
}

 module.exports = serverHandle