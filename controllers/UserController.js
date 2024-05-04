const UserModel = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dael2ocmy',
    api_key: '358966132936553',
    api_secret: 'ogV5HSW5zSMFf4o7abwHIP2YUlw'
});

class UserController {

    // Get all users
    static getalluser = async (req, res) => {
        try {
            const getalluserData = await UserModel.find();
            res.status(200).json({
                success: true,
                data: getalluserData
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    // Get details of a specific user
    static getuserdetails = async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.id);
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    // Insert a new user
    static userinsert = async (req, res) => {
        try {
            // Extract data from request body
            const { name, email, password, confirmpassword } = req.body;
            const file = req.files.image;

            // Upload image to Cloudinary
            const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'profileimageapi'
            });

            // Check if user already exists
            const user = await UserModel.findOne({ email: email });
            if (user) {
                return res.status(401).json({ success: false, message: "Email already exists" });
            }

            // Hash password
            const hashpassword = await bcrypt.hash(password, 10);

            // Create new user instance
            const newUser = new UserModel({
                name: name,
                email: email,
                password: hashpassword,
                image: {
                    public_id: image_upload.public_id,
                    url: image_upload.secure_url
                }
            });

            // Save user to database
            await newUser.save();

            res.status(201).json({
                success: true,
                message: "Registration successful"
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    // Login user
    static loginUser = async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await UserModel.findOne({ email: email });
            if (!user) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }

            const isMatched = await bcrypt.compare(password, user.password);
            if (!isMatched) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }

            // Generate JWT token
            const token = jwt.sign({ ID: user._id }, 'your_secret_key');
            res.cookie('token', token);
            res.status(200).json({
                success: true,
                message: "Login successful",
                token: token,
                user: user
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    // Update password
    static updatePassword = async (req, res) => {
        try {
            const { oldpassword, newpassword, confirmpassword } = req.body;

            const user = await UserModel.findById(req.user._id);
            const isMatched = await bcrypt.compare(oldpassword, user.password);
            if (!isMatched) {
                return res.status(400).json({ success: false, message: "Old password is incorrect" });
            }

            if (newpassword !== confirmpassword) {
                return res.status(400).json({ success: false, message: "New passwords do not match" });
            }

            // Hash new password
            const newHashPassword = await bcrypt.hash(newpassword, 10);
            await UserModel.findByIdAndUpdate(req.user._id, { password: newHashPassword });

            res.status(200).json({ success: true, message: "Password changed successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    // Update user profile
    static updateprofile = async (req, res) => {
        try {
            const { name, email } = req.body;
            const updates = { name, email };

            if (req.files && req.files.image) {
                // Upload new profile image
                const file = req.files.image;
                const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'profileimageapi',
                    width: 150,
                    crop: 'scale'
                });
                updates.image = {
                    public_id: image_upload.public_id,
                    url: image_upload.secure_url
                };
            }

            // Update user profile
            await UserModel.findByIdAndUpdate(req.user._id, updates);

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    // View user by ID
    static View = async (req, res) => {
        try {
            const user = await UserModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }

    // Logout user
    static logout = async (req, res) => {
        try {
            res.cookie('token', null, {
                expires: new Date(Date.now()),
                httpOnly: true
            });

            res.status(200).json({
                success: true,
                message: 'Logged Out'
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error'
            });
        }
    }
}

module.exports = UserController;
