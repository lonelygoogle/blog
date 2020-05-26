const { exec } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const login = (username, password) => {

    // 生成加密密码
    password = genPassword(password)
    const sql = `
        select username,realname from users where username='${username}' and password='${password}'
    `
    return exec(sql).then(raws =>{
        return raws[0] || {}
    })
}

module.exports = {
    login
}