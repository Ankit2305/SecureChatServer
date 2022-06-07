const uuid = require('uuid').v4
const db = require('./db')

async function fetchPendingChats(userId) {
    var chats = await db.fetchPendingChats(userId)
    console.log(chats)
}

function deleteChat(chatId) {
    db.deleteChat(chatId)
}

function addChat(chat) {
    db.addChat(chat)
}

function chatFromMessage(message) {
    message.chatId = uuid()
    return message
}

async function fetchGroupById(groupId) {
    return await db.fetchGroupById(groupId)
}

module.exports = {
    fetchPendingChats: fetchPendingChats,
    deleteChat: deleteChat,
    addChat: addChat,
    chatFromMessage: chatFromMessage,
    fetchGroupById: fetchGroupById
}