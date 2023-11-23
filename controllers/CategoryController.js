const CategoryModel = require('../models/Category')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dael2ocmy',
    api_key: '358966132936553',
    api_secret: 'ogV5HSW5zSMFf4o7abwHIP2YUlw'
});
class CategoryController {

    static categoryinsert = async (req, res) => {
        try {
            const { cname, image } = req.body
            const file = req.files.image
            const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'profileimageapi',
            })
            const result = new CategoryModel({
                cname: cname,
                image: {
                    public_id: image_upload.public_id,
                    url: image_upload.secure_url,
                }
            })
            await result.save()
            res.status(201).json({
                status: "success",
                message: "Category inserted successfully",
            })

        } catch (error) {
            console.log(error)

        }
    }

    static categorydisplay = async (req, res) => {
        try {
            const category = await CategoryModel.find()
            //console.log(category)
            res.status(201).json({
                status: "success",
                message: "successfully",
                category,
            })
        } catch (error) {
            console.log(error)
        }
    }

    static categoryupdate = async (req, res) => {
        try {
            if (req.files) {
                //console.log(req.params.id)
                const { cname, image } = req.body
                const category = await CategoryModel.findById(req.params.id)
                const imageid = category.image.public_id
                //console.log(imageid
                await cloudinary.uploader.destroy(imageid)
                const file = req.files.image
                const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'profileimageapi',
                })
                var data = {
                    cname: cname,
                    image: {
                        public_id: image_upload.public_id,
                        url: image_upload.secure_url,
                    }
                }
            } else {
                var data = {
                    cname: cname,
                }
            }
            const update = await CategoryModel.findByIdAndUpdate(req.params.id, data)
            res.status(201).json({
                status: "success",
                message: "successfull",
                update,
            })

        }
        catch (error) {
            console.log(error)
        }
    }

    static categoryview = async (req, res) => {
        try {
            //console.log(req.params.id)
            const category = await CategoryModel.findById(req.params.id)
            res.status(201).json({
                status: "success",
                message: "successfully",
                category,
            })
        } catch (error) {
            console.log(error)
        }
    }

    static categorydelete = async (req, res) => {
        try {
            //console.log(req.params.id)
            const category = await CategoryModel.findByIdAndDelete(req.params.id)
            res.status(201).json({
                status: "success",
                message: "Delete Successfully",
            })
        } catch (error) {
            console.log(error)
        }
    }

}


module.exports = CategoryController