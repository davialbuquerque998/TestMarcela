import express from "express";
import { productRouter } from "./routes/product.routes";
import { adminRouter } from "./routes/admin.routes";
import morgan from "morgan";
import cors from "cors";
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import path from "path";
import { defaultRouter } from "./routes/default.routes";
import { mailRouter } from "./routes/mail.route";
dotenv.config();

const PORT: number = parseInt(`${process.env.PORT}`) || 8080;

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use("/products", productRouter);
app.use("/admin", adminRouter);
app.use("/", defaultRouter);
app.use("/contact", mailRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});