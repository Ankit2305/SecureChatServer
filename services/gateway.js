const SocketServer = require('websocket').server
const http = require('http')
const express = require('express')
const webSocketCallbacks = require('./webSocketHelper').webSocketCallbacks
const keyHelper = require('./keyHelper')

const app = express()

app.use(express.static(__dirname + './../public'))
app.use(express.json())

app.post('/login', (req, res) => {
    res.send("Login...")
})

//TODO: move key routes to different module
//TODO: add authcode middleware
// app.post('/key', (req, res) => {
//     const userId = req.body.userId
//     const key = req.body.key
//     keyHelper.addPublicKey(userId, key)
// })

// app.get('/key', (req, res) => {
    
// })

const server = http.createServer(app)
wsServer = new SocketServer({httpServer:server})

wsServer.on('request', (req) => {
    const connection = req.accept()
    webSocketCallbacks.addConnection(connection)

    connection.on('message', (message) => {
        try {
            webSocketCallbacks.onMessageReceived(JSON.parse(message.utf8Data), connection)
        } catch {
            webSocketCallbacks.handleError(connection)
        }
    })

    connection.on('close', (resCode, des) => {
        webSocketCallbacks.closeConnection(connection)
    })

})

module.exports.server = server