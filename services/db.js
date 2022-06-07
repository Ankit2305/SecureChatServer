const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const _ = require('lodash');
const { stringify } = require('uuid');

const serviceAccount = require('./admin.json');

initializeApp({
  credential: cert(serviceAccount)
});

const GROUP_COLLECTION = 'groups'
const USER_COLLECTION = 'user'
const CHAT_COLLECTION = 'chats'

const db = getFirestore();

const fetchData = async (collection) => {
    const snapshot = await db.collection(collection).get();
    return dataFromSnapshot(snapshot)
}

function dataFromSnapshot(snapshot) {
    const data = []
    var index = 0
    snapshot.forEach((doc) => {
        data[index] = doc.data()
        index ++;
    })
    return data
}

const fetchGroup = async () => {
    const users = await fetchData(USER_COLLECTION)
    const groups = await fetchData(GROUP_COLLECTION)
    groups.forEach(group => populateGroup(group, users))
    
    groups.forEach((group) => {
        console.log(group)
    })
}

async function fetchGroupById(groupId) {
    const users = await fetchData(USER_COLLECTION)
    var group = await db.collection(GROUP_COLLECTION).where('groupId', '==', groupId).get()
    group = dataFromSnapshot(group)
    console.log(group)
    return populateGroup(group[0], users)
}

function populateGroup(group, users) {
    const memberList = []
    group.members.forEach((userid, index) => {
        memberList[index] = users.find(user => user.uid === userid.trim())
     })
     group.members = memberList
     return group
}



async function fetchPendingChats(userId) {
    var userChatSnapshot = await db.collection(CHAT_COLLECTION).where('to','==',userId).get();
    return dataFromSnapshot(userChatSnapshot)
}

async function deleteChat(chatId) {
    var deleteChatQuery = db.collection(CHAT_COLLECTION).where('chatId','==',chatId);
    deleteChatQuery.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            doc.ref.delete();
        });
    });
}

async function addChat(chat) {
    const chatDb = db.collection(CHAT_COLLECTION)
    const newChat = chatDb.doc(chat.chatId)
    console.log(JSON.stringify(chat))
    await newChat.set(
        chat
    )
}

module.exports = {
    fetchData: fetchData,
    fetchGroup: fetchGroup,
    fetchPendingChats: fetchPendingChats,
    deleteChat: deleteChat,
    addChat: addChat,
    fetchGroupById: fetchGroupById
}