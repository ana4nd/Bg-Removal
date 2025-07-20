import 'dotenv/config'
import express from "express"
import cors from "cors"
import connectDB from './configs/db.js';


// App Config
const PORT = process.env.PORT || 3000;
const app = express();

// connect database
await connectDB();

// Intialize Middleware
app.use(express.json())
app.use(cors())

// API Routes


app.get("/", (req,res)=>{
    res.send("API Working");
})

app.listen(PORT, ()=>{
    console.log(`Server Running on PORT ${PORT}`)
})
