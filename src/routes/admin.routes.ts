import { Router, Request, Response } from 'express';
import multer from 'multer';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateCredentials, generateToken } from '../config/auth';
import { getProducts, insertProduct, updateProduct, deleteProduct, getProductById } from '../config/database';
import { deleteFromCloudinary, uploadToCloudinary } from '../config/cloudinary';
import path from 'path';

const adminRouter = Router();
const upload = multer({ dest: 'uploads/' });

// Login page
adminRouter.get('/login', (req: Request, res: Response) => {
    res.render('login');
    return;
});

// Login handler
adminRouter.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (await validateCredentials({ username, password })) {
        const token = generateToken(username);
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin/dashboard');
        return;
    } else {
        res.render('login', { error: 'Invalid credentials' });
        return;
    }
});

// Dashboard
adminRouter.get('/dashboard', authMiddleware, async (req: Request, res: Response) => {
    const products = await getProducts();
    res.render('dashboard', { products });
    return;
});

// Create product
adminRouter.post('/products', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
    try {
        const { name, description, price } = req.body;
        const imageUrl = await uploadToCloudinary(req.file!);
        
        await insertProduct({
            name,
            description,
            price: parseFloat(price),
            imageUrl
        });
        
        res.redirect('/admin/dashboard');
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error creating product' });
        return;
    }
});

// Update product
adminRouter.put('/products/:id', authMiddleware, upload.single('image'), async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price } = req.body;
        let imageUrl = req.body.currentImageUrl;

        if (req.file) {
            imageUrl = await uploadToCloudinary(req.file);
        }

        await updateProduct(id, {
            name,
            description,
            price: parseFloat(price),
            imageUrl
        });

        res.json({ success: true });
        return;
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
        return;
    }
});

adminRouter.delete('/products/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // First, get the product to access its imageUrl
        const product = await getProductById(id);
        
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }

        // Delete the image from Cloudinary
        await deleteFromCloudinary(product.imageUrl);

        // Then delete the product from MongoDB
        await deleteProduct(id);

        res.json({ success: true });
        return;
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Error deleting product' });
        return;
    }
});

export { adminRouter };