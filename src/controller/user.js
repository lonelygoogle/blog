const loginCheck = (username, password) => {
    if (username === '黄思沁' && password === '123') {
        return true
    } else {
        return false
    }
}

module.exports = {
    loginCheck
}