const Constants = require('../util/constants').Constants
const connectionHelper = require('./connection').connectionHelper

const onMessageReceived = (message, connection) => {
    const messageType = message.type
    console.log(messageType)
    switch(messageType) {
        case Constants.MessageType.AUTH_MESSAGE: 
            handleAuthMessage(message, connection)
            break
        case Constants.MessageType.TEXT_MESSAGE:
            handleTextMessage(message)
            break
        case Constants.MessageType.GROUP_TEXT_MESSAGE:
            handleGroupTextMessage(message)
            break
        case Constants.MessageType.FEEDBACK_MESSAGE:
            handleFeedBackMessage(message)
            break
        default:
            handleInvalidMessageType()
    }
}

const closeConnection = (connection) => {
    console.log("Connection closed...")
    connectionHelper.closeConnection(connection)
}

const addConnection = (connection) => {
    console.log("New connection...")
    connectionHelper.addConnection(connection)
}

function handleInvalidMessageType() {
    console.log("Invalid message type...")
}

function handleTextMessage(message) {
    delete message.type
    if(message.to == null)
        connectionHelper.broadcastMessage(JSON.stringify(message))
    else 
        connectionHelper.sendMessage(message)
}

function handleGroupTextMessage(message) {
    delete message.type
    if(message.to == null)
        connectionHelper.broadcastMessage(JSON.stringify(message))
    else 
        connectionHelper.sendGroupMessage(message)
}

function handleAuthMessage(message, connection) {
    connectionHelper.authorizeConnection(message, connection)
}

function handleFeedBackMessage(message) {
    connectionHelper.handleChatFeedBackMessage(message)
}

function handleError(connection) {
    connection.send("FAILED...")
}

module.exports.webSocketCallbacks = {
    onMessageReceived: onMessageReceived,
    closeConnection: closeConnection,
    addConnection: addConnection,
    handleError: handleError
}