import { Router, Request, Response } from "express";
import { getProducts } from "../config/database";

const defaultRouter = Router();

defaultRouter.get("/", async (req:Request, res:Response) => {
    try {
        res.redirect("/products");
        return;
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({message:"Server error"});
        return;
    }
});

export {defaultRouter}
