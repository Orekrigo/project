import axios from "axios";

// book
async function getBookList(params) {
    return await axios.get(`api/book?page=${params}`)
}

async function getBookDetail(id) {
    return await axios.get(`api/book/${id}/`)
}

async function putBookInfo(id, params) {
    return await axios.put(`api/book/${id}/`, params)
}

async function getBookByTitle(title) {
    return await axios.get(`api/book/?title=${title}`)
}

async function getBookByAuthor(author) {
    return await axios.get(`api/book/?author=${author}`)
}

async function getBookByPublish(publish) {
    return await axios.get(`api/book/?publish=${publish}`)
}

async function getBookByClass(classification) {
    return await axios.get(`api/book/?classification=${classification}`)
}

async function postBookInfo(params) {
    return await axios.post(`api/book/`, params)
}

async function deleteBook(id) {
    return await axios.delete(`api/book/${id}/`)
}

// user
async function getUsernameDetail(params) {
    return await axios.get(`api/user/?username=${params}`)
}

async function getUserIDDetail(id) {
    return await axios.get(`api/user/${id}/`)
}

async function postRegister(params) {
    return await axios.post('api/user/', params)
}

async function putPersonalInfo(id, params) {
    return await axios.put(`api/user/${id}/`, params)
}

async function deleteUser(id) {
    return await axios.delete(`api/user/${id}/`)
}

async function getUserList() {
    return await axios.get(`api/user/`)
}

async function searchUser(params) {
    return await axios.get(`api/user/?search=${params}`)
}


// comment

async function getCommentByBookID(id) {
    return await axios.get(`api/comment/?bookid=${id}&ordering=-time`)
}

async function postComment(params) {
    return await axios.post(`api/comment/`, params)
}

async function getCommentByUserID(id) {
    return await axios.get(`api/comment/?userid=${id}&ordering=-time`)
}

async function deleteCommentInfo(id) {
    return await axios.delete(`api/comment/${id}`)
}

async function getCommentList() {
    return await axios.get(`api/comment/`)
}

async function searchComment(params) {
    return await axios.get(`api/comment/?search=${params}`)
}

async function putComment(id, params) {
    return await axios.put(`api/comment/${id}/`, params)
}

// borrow
async function postBorrowInfo(params) {
    return await axios.post(`api/borrow/`, params)
}

async function getBorrowInfoByUserAndBook(userid, bookid) {
    return await axios.get(`api/borrow/?userid=${userid}&bookid=${bookid}`)
}

async function getBorrowListByUser(userid) {
    return await axios.get(`api/borrow/?userid=${userid}&ordering=-borrowtime`)
}

async function putBorrowInfo(id, params) {
    return await axios.put(`api/borrow/${id}/`, params)
}

async function deleteBorrowInfo(id) {
    return await axios.delete(`api/borrow/${id}/`)
}

async function getAllBorrowInfo() {
    return await axios.get(`api/borrow/`)
}

// admin
async function getAdminInfoByUsername(username) {
    return await axios.get(`api/admin/?username=${username}`)
}

async function getAdminInfoByID(id) {
    return await axios.get(`api/admin/${id}/`)
}

async function putAdminInfo(id, params) {
    return await axios.put(`api/admin/${id}/`, params)
}

async function deleteAdminInfo(id) {
    return await axios.delete(`api/admin/${id}/`)
}

async function getAdminList() {
    return await axios.get(`api/admin/`)
}

async function searchAdmin(params) {
    return await axios.get(`api/admin/?search=${params}`)
}

async function postAdminInfo(params) {
    return await axios.post(`api/admin/`, params)
}

//bookAll
async function getBookAllList() {
    return await axios.get(`api/bookAll`)
}

async function searchBook(params) {
    return await axios.get(`api/bookAll/?search=${params}`)
}

//recommendation
async function getRecommendByUser(userid) {
    return await axios.get(`api/recommend/?userid=${userid}`)
}
async function getRecommendList() {
    return await axios.get(`api/recommend/`)
}

export {
    getBookList,
    getBookDetail,
    getUsernameDetail,
    postRegister,
    getUserIDDetail,
    putPersonalInfo,
    deleteUser,
    getCommentByBookID,
    postComment,
    putBookInfo,
    getCommentByUserID,
    deleteCommentInfo,
    postBorrowInfo,
    getBorrowInfoByUserAndBook,
    getBookByTitle,
    getBookByAuthor,
    getBookByPublish,
    getAdminInfoByUsername,
    getBorrowListByUser,
    putBorrowInfo,
    deleteBorrowInfo,
    getAllBorrowInfo,
    getBookByClass,
    getAdminInfoByID,
    putAdminInfo,
    deleteAdminInfo,
    getUserList,
    getBookAllList,
    searchUser,
    searchBook,
    postBookInfo,
    deleteBook,
    getAdminList,
    searchAdmin,
    postAdminInfo,
    getCommentList,
    searchComment,
    putComment,
    getRecommendByUser,
    getRecommendList
}