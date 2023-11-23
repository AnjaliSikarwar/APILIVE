const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
    cname: {
        type: String,
        required: true,
    },
    image: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
},
    { timestamps: true }
)
const CategoryModel = mongoose.model('Category', CategorySchema)
module.exports = CategoryModel