const SocketServer = require('websocket').server
const http = require('http')
const express = require('express')

const app = express()

let channel = "<h3>Messages over this channel</h3>"

app.use(express.static(__dirname + '/public'))
app.get('/channel', (req, res) => {
    res.send(channel)
})

const server = http.createServer(app)
wsServer = new SocketServer({httpServer:server})


const connections = []

wsServer.on('request', (req) => {
    const connection = req.accept()
    console.log('New connection')
    connections.push(connection)

    connection.on('message', (mes) => {
        channel = `${channel} <p>${mes.utf8Data.text}</p>`
        connections.forEach(element => {
            if (element != connection)
                element.sendUTF(mes.utf8Data)
        })
    })

    connection.on('close', (resCode, des) => {
        console.log(`Connection closed...`)
        connections.splice(connections.indexOf(connection), 1)
    })

})

server.listen(3000, ()=>{
    console.log("Listening on port 3000...")
})