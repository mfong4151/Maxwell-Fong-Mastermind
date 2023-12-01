import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRouter from './routes';

const app = express()

const PORT = process.env.PORT_NO || 5000;

app.use(express.json(), cors())
app.use('/api', apiRouter)

app.listen(PORT, ()=>{
    console.log(`Server listening in on port http://localhost:${PORT}`)
})