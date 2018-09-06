import express from 'express';
import validateInput from '../utils/validateInput';
import landingPage from '../controllers/landingPage';
// import invoice from '../controllers/invoice';
// import products from '../controllers/products';
// import quotes from '../controllers/quotes';
// import receipts from '../controllers/receipts';
// import suppliers from '../controllers/suppliers';
import jwtVerify from '../utils/jwtVerify';

const router = express.Router();
// ========= Buyer Routes ========
// signup route
router.post('/user/signup', validateInput.signupInput, landingPage.signup);
// router.post('/buyer/signin', validateInput.signInInput, buyers.signin);

// // ===== Supplier Routes =====
// router.post('/supplier/signup', validateInput.supplierSignupInput, suppliers.signup);
// router.post('/supplier/signin', validateInput.signInInput, suppliers.signin);

// // ===== Invoice Routes =====
// router.post('/invoice', jwtVerify.hasToken, validateInput.invoiceInput, invoice.createInvoice);
// router.get('/invoice', jwtVerify.hasToken, validateInput.getInvoice, invoice.getOneInvoice);
// router.get('/invoices', jwtVerify.hasToken, invoice.getAllInvoice);

// // ===== Product Routes =====
// router.post('/product', jwtVerify.hasToken, validateInput.createProduct, products.createProduct);
// router.get('/product', jwtVerify.hasToken, validateInput.getProduct, products.getOneProduct);
// router.get('/products', jwtVerify.hasToken, products.getAllProducts);
// router.get('/products/:supplier', jwtVerify.hasToken, products.getBySupplier);
// router.delete('/product', jwtVerify.hasToken, validateInput.getProduct, products.deleteProduct);

export default router;
