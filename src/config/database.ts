import { MongoClient, Db } from 'mongodb';
import dotenv from "dotenv";
dotenv.config();

let singleton: any;

const MONGO_URI:string = `${process.env.MONGO_URI}`;
const MONGO_DATABASE:string = `${process.env.MONGO_DATABASE}`;

export async function connectDB():Promise<Db> {
    if(singleton) return singleton;

    const client:MongoClient = new MongoClient(MONGO_URI);
   
    try {
        await client.connect();
        singleton = client.db(MONGO_DATABASE);
        console.log("Connected!");
    } catch (error) {
        console.error(error);
        singleton = null;
    }
    return singleton;
}

export async function getProducts() {
    const db = await connectDB();

    const products =  db.collection("store-products").find().toArray();

    return products;
}