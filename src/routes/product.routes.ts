import { Router, Request, Response } from "express";
import { getProducts } from "../config/database";

const productRouter = Router();

productRouter.get("/", async (req:Request, res:Response) => {
    try {
        const products = await getProducts();
        res.render("index", {products:products});
        return;
    } catch (error) {
        console.error('Error fetching products:', error);
        res.render('index', { products: [] });
        return;
    }
});

export {productRouter}