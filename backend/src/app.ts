import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express()

const PORT = process.env.PORT_NO || 5000;


app.use(express.json(), cors())

app.get('/', (req: Request, res: Response) =>{
    return res.send('hello world')  
})

app.listen(PORT, ()=>{
    console.log(`Server listening in on port http://localhost:${PORT}`)
})