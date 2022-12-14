import express, { NextFunction, Request, Response } from "express";
import cors from 'cors';
import parcelRouter from "./Routes/parcels";
import userRoutes from "./Routes/users";

const app = express();

// cor headers to enable node receive request from external sources 
const corsOptions = { credentials: true, origin: process.env.URL || "*" };
app.use(express.json()) //explicitly define the expected results 

app.use(cors(corsOptions));

// mapping my parcel and user routes 
app.use('/parcels', parcelRouter);
app.use('/user', userRoutes)
// end of mapping my routes 

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.json({
    Error: error.message,
  });
});

// starting the server 
app.listen(5000,()=>{
    console.log("Serve is Listening to port 5000");
    
})
