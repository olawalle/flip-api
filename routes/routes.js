import express from 'express';
import validateInput from '../utils/validateInput';
import subject from '../controllers/subject';
import jwtVerify from '../utils/jwtVerify';
import user from '../controllers/user';
import textbook from '../controllers/textbook';
import notes from '../controllers/notes';
import flip from '../controllers/flip'

const { hasToken, isAdmin } = jwtVerify;

const router = express.Router();
// ========= User Routes ========

// signup route
router.post('/user/signup', validateInput.signupInput, user.signup);

// Get Users
router.get('/users', user.getUsers);

// Signin  Route
router.post('/user/signin', validateInput.signInInput, user.signin);


router.get('/me', hasToken, user.currentUser);

// Create Admin
router.post('/user/admin', validateInput.createAdmin, hasToken, user.createAdmin);

// Admin Login
router.post('/user/admin/signin', validateInput.adminSigin, user.loginAdmin);

// Get One User
router.get('/user/id/:id', hasToken, user.getOneUser);

// Add User Subjects
router.post('/user/subject', validateInput.userSubject, hasToken, user.addUserSubject);

// Add User Subjects
router.post('/flip', hasToken, flip.addFlip);

// get all flips
router.get('/flip', hasToken, user.getFlips);

// Getuser subjects
router.get('/user/subjects', hasToken, user.getUserSubjects);

// Get user Flips
router.get('/user/flips', hasToken, user.getUserFlips);

// Add flip to user bookmarks
router.post('/user/flips', hasToken, user.bookmarkFlip)


// ===== Subject Routes =====

// Create Subject
router.post('/subject', validateInput.subjectInput, hasToken, isAdmin, subject.createSubject);

// Get All Subjects
router.get('/subjects', subject.getAllSubjects);

// Get Subjects By class
router.get('/subject/class/:class', hasToken, subject.getSubjectByClass);


// ===== Book Routes =====

// Upload Book
router.put('/upload', hasToken, isAdmin, textbook.handleFileUpload);

// Get One Book
router.get('/textbook/id/:id', hasToken, textbook.getBookById);

// Get Books By Class
router.get('/textbook/class/:class', hasToken, textbook.getAllBooksByClass);

// Get Books By Subject
router.get('/textbook/subject/:subject', textbook.getAllBooksBySubject);


// ====== Notes Routes ======

// Create Note
router.post('/note', hasToken, notes.createNote);

// Get All Notes
router.get('/notes', hasToken, notes.getAllNotes);

// Get All Notes By Topic
router.get('/notes/topic/:topicId', hasToken, notes.getNoteByTopic);

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
