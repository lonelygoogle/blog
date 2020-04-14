const getList = (author, keyword) => {
    return [
        {
            id: 1,
            title: '标题1',
            content: '内容1',
            creatTime: 1586836765253,
            author: '黄思沁'
        },
        {
            id: 2,
            title: '标题2',
            content: '内容2',
            creatTime: 1586843248173,
            author: '郑玮臻'
        }
    ]
}

const getDetail = (id) => {
    return [
        {
            id: 1,
            title: '标题1',
            content: '内容1',
            creatTime: 1586836765253,
            author: '黄思沁'
        }
    ]
}

const newBlog = (blogData = {}) => {
    // blogData是一个博客对象，包含title，content等属性
    console.log('new blog data is', blogData)
    return {
        id: 3 //表示新建博客插入数据里面的3
    }
}

const updateBlog = (id,blogData = {}) => {
    console.log('update is ', id, blogData)
    return true
}

const delBlog = (id) => {
    console.log('del is ', id)
    return true
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}