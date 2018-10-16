import express from 'express';
import validateInput from '../utils/validateInput';
import subject from '../controllers/subject';
import jwtVerify from '../utils/jwtVerify';
import user from '../controllers/user';

const { hasToken, isAdmin } = jwtVerify;

const router = express.Router();
// ========= User Routes ========

// signup route
router.post('/user/signup', validateInput.signupInput, user.signup);

// Get Users
router.get('/users', user.getUsers);

// Signin  Route
router.post('/user/signin', validateInput.signInInput, user.signin);

// Create Admin
router.post('/user/admin', validateInput.createAdmin, hasToken, user.createAdmin);

// Admin Login
router.post('/user/admin/sigin', validateInput.adminSigin, user.loginAdmin);

// Get One User
router.get('/user/id/:id', hasToken, isAdmin, user.getOneUser);

// Add User Subjects
router.post('/user/subject', validateInput.userSubject, hasToken, user.addUserSubject);

// Getuser subjects
router.get('/user/subjects', hasToken, user.getUserSubjects);


// ===== Subject Routes =====

// Create Subject
router.post('/subject', validateInput.subjectInput, hasToken, isAdmin, subject.createSubject);

// Get All Subjects
router.get('/subjects', hasToken, subject.getAllSubjects);

// Get Subjects By class
router.get('/subject/class/:class', hasToken, subject.getSubjectByClass);

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
