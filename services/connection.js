const { connection } = require("websocket")

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
    const sendToConnection = connectionOfMobile[message.to]
    if(sendToConnection != null) {
        sendToConnection.sendUTF(JSON.stringify(message))
    }
}

function authorizeConnection(message, connection) {
    if(message.authCode != null && connectionOfMobile[message.authCode] == null && connectionsWaitingAuth.includes(connection)) {
        connectionsWaitingAuth.splice(connectionsWaitingAuth.indexOf(connection), 1)
        connectionOfMobile[message.authCode] = connection
        connection.authCode = message.authCode
        connections.push(connection)
        connection.sendUTF("Authorized...")
    }
}

module.exports.connectionHelper = {
    addConnection: addConnection,
    closeConnection: closeConnection,
    broadcastMessage: broadcastMessage,
    authorizeConnection: authorizeConnection,
    sendMessage: sendMessage
}