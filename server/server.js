import dotenv from "dotenv";
import express from "express"
import cors from "cors"
import connectDB from './config/db.js';
import router from './routes/userRoutes.js';
import imageRouter from './routes/imageRoutes.js';

// App Config
dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// connect database
await connectDB();

// Intialize Middleware
app.use(express.json()); // Add this line to parse the request body
app.use(cors())

// API Routes

app.get("/", (req,res)=>{
    res.send("API Working");
})

app.use("/api/user", router);
app.use('/api/image', imageRouter);

app.listen(PORT, ()=>{
    console.log(`Server Running on PORT ${PORT}`)
})