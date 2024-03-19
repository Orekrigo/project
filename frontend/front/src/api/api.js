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
    getAdminInfoByID
}