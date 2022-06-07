const { connection } = require("websocket")
const chat = require("./chat")

const connections = []
const connectionsWaitingAuth = []
const connectionOfMobile = {}

function addConnection(connection) {
    connectionsWaitingAuth.push(connection)
}

function closeConnection(connection) {
    if(connections.includes(connection)) {
        connections.splice(connections.indexOf(connection), 1)
        connectionOfMobile[connection.authCode] = null
    } else if(connectionsWaitingAuth.includes(connection)){
        connectionsWaitingAuth.splice(connectionsWaitingAuth.indexOf(connection), 1)
    }
}

function broadcastMessage(message, connection) {
    connections.forEach(element => {
        if (element != connection)
            element.sendUTF(message)
    })
}

function sendMessage(message) {
    console.log(message)
    const sendToConnection = connectionOfMobile[message.to]
    if(sendToConnection != null) {
        //const currentChat = chatFromMessage(message)
        sendToConnection.sendUTF(JSON.stringify(message))
        //chat.addChat(currentChat)
    }
}

async function sendGroupMessage(message) {
    const group = await chat.fetchGroupById(message.to)
    if(group != null) {
        group.members.forEach((user) => {
            console.log(message)
            console.log(user.name, user.uid)
            const connection = connectionOfMobile[user.uid]
            if(connection != null && user.uid != message.sender) {
                connection.sendUTF(JSON.stringify(message))
            }
        })
    }
}

function handleChatFeedBackMessage(message) {
    if(message.chatId !== null) {
        chat.deleteChat(message.chatId)
    }
}

function authorizeConnection(message, connection) {
    if(message.authCode != null && connectionOfMobile[message.authCode] == null && connectionsWaitingAuth.includes(connection)) {
        connectionsWaitingAuth.splice(connectionsWaitingAuth.indexOf(connection), 1)
        connectionOfMobile[message.authCode] = connection
        connection.authCode = message.authCode
        connections.push(connection)
        connection.sendUTF("Authorized...")

        //chat.fetchPendingChats()
    }
}

module.exports.connectionHelper = {
    addConnection: addConnection,
    closeConnection: closeConnection,
    broadcastMessage: broadcastMessage,
    authorizeConnection: authorizeConnection,
    sendMessage: sendMessage,
    handleChatFeedBackMessage: handleChatFeedBackMessage,
    sendGroupMessage: sendGroupMessage
}