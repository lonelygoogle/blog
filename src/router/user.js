/*
 * @Description: 
 * @Author:  
 * @Date: 2020-04-14 17:53:45
 * @LastEditTime: 2020-04-25 21:47:51
 * @LastEditors:  
 */

const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } =require('../model/resModel')

const handleUserRouter = (req, res) => {
    const method = req.method;


    // 登录 
    if (method === 'GET' && req.path === '/api/user/login') {
        // const { username, password } = req.body
        const { username, password } = req.query
        const result = login(username, password)
        return result.then(data => {
            if (data.username) {
                // 设置session
                req.session.username = data.username
                req.session.realname = data.realname
                console.log('req.session is', req.session)
                console.log(Math.random())
                return new SuccessModel()
            } else {
                return new ErrorModel('登陆失败')
            }
        })
    }

    //登录验证
    if (method === 'GET' && req.path === '/api/user/login-test') {
        if (req.session.username) {
            return Promise.resolve(new SuccessModel({
                session : req.session
            }
            )) 
        } else {
            return Promise.resolve(new ErrorModel('尚未登录')) 
        }
    }
}


module.exports = handleUserRouter