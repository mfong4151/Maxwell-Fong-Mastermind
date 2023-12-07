import { Socket, Server } from "socket.io"

const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true
    }
  })
  
  io.on('connection',(socket: Socket) => {
    console.log(`User with id ${socket.id} has connected`)
    
    socket.on("guess", guess =>{
      socket.broadcast.emit('recieve-guess', guess)
    })
  })
  

}

export default initializeSocket;