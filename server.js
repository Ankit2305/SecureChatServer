const server = require('./services/gateway').server
const { fetchGroup } = require('./services/db')
const chat = require('./services/chat')

const PORT = process.env.PORT || 3000

server.listen(PORT , ()=>{
    console.log("Listening on port 3000...")
})


// chat.deleteChat('3TgwcY58QUT9Hvnctqvw')
// chat.addChat({
//     chatId: '2134',
//     receiver: 'userid'
// })
// chat.fetchPendingChats('userid')
