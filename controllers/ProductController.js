const productModel = require('../models/Product')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dael2ocmy',
    api_key: '358966132936553',
    api_secret: 'ogV5HSW5zSMFf4o7abwHIP2YUlw'
});

class ProductController {

  static getAllProducts = async (req, res) => {
    try {
      const getAllProductData = await productModel.find()
      res.status(200).json({
        success: true,
        getAllProductData
      })
    } catch (error) {
      res.send(error)
      console.log(error)
    }
  }

  //Admin
  // static createProduct = async (req, res) => {
  //   try {
  //     const data = await productModel.create(req.body)
  //     // console.log(data);
  //     // res.send(data)
  //     res.status(200).send({
  //       status: "success",
  //       data
  //     })
  //   } catch (error) {
  //     res.send(error)
  //     console.log(error)
  //   }
  // }

  static createProduct = async (req, res) => {
    try {
      const { images } = req.body
      const file = req.files.images
      const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'productimagesEcommApi'
      })
      const result = new productModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock,
        rating: req.body.rating,
        category: req.body.category,
        images: {
          public_id: image_upload.public_id,
          url: image_upload.secure_url,
        },
      })
      await result.save()
      res.status(201).json({
        status: "success",
        message: "Product Inserted successfully 😃🍻"
      })
    } catch (error) {
      console.log(error)
    }
  }

  static getProductDetail = async (req, res) => { //still confusion actually what to show, product id? 
    try {
      const getProductdata = await productModel.findById(req.params.id)
      // console.log(getProductdata)
      res.status(200).json({
        success: true,
        getProductdata,
      });
    } catch (error) {
      res.send(error)
      console.log(error)
    }
  }

  static getAdminProduct = async (req, res) => {
    try {
      const getAdminProductData = await productModel.find()
      res.status(200).json({
        success: true,
        getAdminProductData
      })
    } catch (error) {
      res.send(error)
    }
  }

  // static updateProduct = async (req, res) => {
  //   try {
  //     // const updateproductdata = await productModel.findById(req.params.id)
  //     // when we want to update the img then the above line is needed
  //     // console.log(updateproductdata);
  //     // res.send(updateproductdata)
  //     const update = await productModel.findByIdAndUpdate(req.params.id, {
  //       name: req.body.name,
  //       description: req.body.description,
  //       price: req.body.price,
  //       stock: req.body.stock,
  //       rating: req.body.rating,
  //       category: req.body.category,
  //     })
  //     //saving data
  //     await update.save();
  //     res.status(200).send({
  //       status: "success",
  //       message: "Update Successfully 😃🍻",
  //     });
  //   } catch (error) {
  //     res.send(error)
  //     console.log(error)
  //   }
  // }

  static updateProduct = async (req, res) => {
    try {
      if (req.files) {
        //console.log(req.params.id)
        const { images } = req.body
        const product = await productModel.findById(req.params.id)
        const imageId = product.images.public_id
        //console.log(imageId);
        await cloudinary.uploader.destroy(imageId)
        const file = req.files.images
        const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'productimagesEcommApi'
        });
        var productData = {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          stock: req.body.stock,
          rating: req.body.rating,
          category: req.body.category,
          images: {
            public_id: image_upload.public_id,
            url: image_upload.secure_url,
          }
        }
      } else {
        var productData = {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          stock: req.body.stock,
          rating: req.body.rating,
          category: req.body.category,
        }
      }
      const updateProductData = await productModel.findByIdAndUpdate(req.params.id, productData)
      res.status(201).json({
        status: 'success',
        message: 'successfull',
        updateProductData,
      })
    } catch (error) {
      console.log(error)
    }
  }

  static deleteProduct = async (req, res) => {
    try {
      // const deleteProductData = await productModel.findById(req.params.id) //ise we'r getting data
      // we'r not doing img work so above line is not needed.
      // console.log(deleteProductData);
      // res.send(deleteProductData)
      const deleteData = await productModel.findByIdAndDelete(req.params.id)
      res.send({
        status: 204,
        message: "deleted successfully",
        deleteData
      }) //204 is no content
    } catch (error) {
      res.send(error)
      console.log(error)
    }
  }

}

module.exports = ProductController