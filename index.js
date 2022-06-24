import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoute from "./routes/auth.js";
import movieRoute from "./routes/movie.js";


const app = express();
dotenv.config()

const connect = async() => {
    try{
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to db")
    }
    catch(error){
        throw error;
    }
};

//middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/movies", movieRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: err.stack,
    });
  });
  const port = process.env.PORT || 5000;
app.listen(port, ()=>{
    connect()
    console.log("connected to backend")
})