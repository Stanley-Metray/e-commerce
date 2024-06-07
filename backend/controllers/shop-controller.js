import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const views = path.join(__dirname, "../../frontend/views");

export const getShop = async (req, res)=>{
    res.sendFile(views+"/shop.html");
}