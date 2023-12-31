const express = require('express')
const UserController = require('../controllers/UserController')
const ProductController = require('../controllers/ProductController')
const CategoryController = require('../controllers/CategoryController')
const router = express.Router()



//usercontroller
router.get('/getalluser',UserController.getalluser)
router.post('/userinsert',UserController.userinsert)
router.post('/loginUser',UserController.loginUser)
router.get('/logoutUser',UserController.logoutUser)
router.get('/view',UserController.View)
router.post('/updatepassword/:_id',UserController.updatePassword)
router.get('/updateprofile/:id',UserController.updateProfile)


//product Controller
router.get('/getAllProducts',ProductController.getAllProducts)
router.post('/createProduct',ProductController.createProduct)
router.get('/getProductDetail/:id',ProductController.getProductDetail)
router.get('/getAdminProduct',ProductController.getAdminProduct)
router.post('/updateProduct/:id',ProductController.updateProduct)
router.get('/deleteProduct',ProductController.deleteProduct)


//Category Controller
router.post('/categoryinsert',CategoryController.categoryinsert)
router.get('/categorydisplay',CategoryController.categorydisplay)
router.post('/categoryupdate/:id',CategoryController.categoryupdate)
router.get('/categoryview/:id',CategoryController.categoryview)
router.get('/categorydelete/:id',CategoryController.categorydelete)







module.exports = router