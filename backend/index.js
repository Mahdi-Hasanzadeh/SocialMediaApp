const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const dotenv = require("dotenv");
const connectDB = require("./utils.js/db");
const userRoute = require("./routes/userRoutes")
const postRoute = require("./routes/postRoutes")
const messageRoute = require("./routes/messageRoutes")
const { app,server } = require("./socket/socket")
const path = require("path")

dotenv.config({});


const PORT = process.env.PORT || 3000;

const _dirname = path.resolve();

console.log(__dirname)

// middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
const corsOptions = {
    origin :  'http://localhost:5173',
    credentials : true
}
app.use(cors(corsOptions));


// Api's 
app.use("/api/v2/user",userRoute);
app.use("/api/v2/post",postRoute);
app.use("/api/v2/message",messageRoute);

app.use(express.static(path.join(_dirname,"/frontend/dist")));
app.get("*",(req,res)=>{
    res.sendFile(path.resolve(_dirname,"/frontend","dist","index.html"))
})






server.listen(PORT,()=>{
    connectDB();
    console.log(`Server is running on ${PORT}`)
})