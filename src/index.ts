import express from "express";
import { productRouter } from "./routes/product.routes";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const PORT:number = parseInt(`${process.env.PORT}`) || 8080;

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the directory for the views
app.set('views', path.join(__dirname, 'views'));


// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
// Serve static files from a public directory (optional, for CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


app.use("/products", productRouter);

app.listen(PORT, ()=>{
    console.log(`Server is listening on PORT ${PORT}`);
});