const express = require('express')
const handlebars = require('express-handlebars')
const http = require('http')
const { Server } = require('socket.io')

const app = express()
/* PORT */
const PORT = process.env.PORT || 8080

/* Server http  */
const server = http.createServer(app)

/* Configuro el socket */
const io = new Server(server)


/* Router del home */
const routerHome = require('./routers/home.router')


/* public */
app.use(express.static(__dirname+"/public"))



/* Views */
app.engine('handlebars', handlebars.engine() )
app.set('view engine','handlebars')
app.set('views',__dirname+"/views")

app.use('/home', routerHome)

let messages = []


/* Logica del websocket */
io.on('connection', (socket) => {
    console.log("new user connected")
    messages = []
    socket.on("new-message", (data)=>{
        console.log(data)
        messages.push(data)
        console.log(messages)
        io.sockets.emit("message-all", messages)
    })
})


server.listen(PORT,()=>{
    console.log('Server on port ',PORT)
})