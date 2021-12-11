const server = require('./services/gateway').server

const PORT = process.env.PORT || 3000

server.listen(PORT , ()=>{
    console.log("Listening on port 3000...")
})