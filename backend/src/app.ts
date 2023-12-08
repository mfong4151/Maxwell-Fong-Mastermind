import express from "express";
import { createServer } from "node:http";
import cors from "cors";
import apiRouter from "./routes";
import initializeSocket from "./sockets";
import { config } from "dotenv";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT_NO || 5000;
config();

app.use(express.json(), cors());
app.use("/api", apiRouter);
initializeSocket(server);

server.listen(PORT, ()=>{
    console.log(`Server listening in on port http://localhost:${PORT}`)
});