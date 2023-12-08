import { Socket, Server } from "socket.io"

const initializeSocket = (server: any) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000"],
      methods: ["GET", "POST"],
      credentials: true
    }
  })
  
  

  io.on("connection",(socket: Socket) => {
    
    socket.on("joinRoom", room => {
      socket.join(room);

    })
    
    socket.on("guess", guess =>{
      socket.to(guess.roomId).emit("recieveGuess", guess)
    })
  })
  

}

export default initializeSocket;