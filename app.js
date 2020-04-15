const querystring = require('querystring')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

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

    //处理postData
    getPostData(req).then(postData => {
        req.body = postData
        // 处理blog路由
        const blogData = handleBlogRouter(req,res)
        if (blogData) {
            res.end(JSON.stringify(blogData))
            console.log('blog返回时',blogData)
            return
        }

        // 处理user路由

        // const userData = handleUserRouter(req,res)
        // if (userData) {
        //     res.end(JSON.stringify(userData))
        //     return
        // }
        const blogResult = handleUserRouter(req,res)
        if (blogResult) {
            blogResult.then((blogData) =>{
                res.end(JSON.stringify(blogData))
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