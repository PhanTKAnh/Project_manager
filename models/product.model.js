const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater')
mongoose.plugin(slug);
const productSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        price: Number,
        discountPercentage: Number,
        stock: Number,
        thumbnail: String,
        status: String,
        featured:String,
        position: Number,
        product_category_id:{
            type:String,
            default:""
        },
        slug: { 
            type: String,
            slug: "title",
            unique: true
         },
        createdBy:{
           account_id: String,
           createAt:{
            type: Date,
            default: Date.now
           }
         },
        updatedBy:[
            {
                account_id: String,
                updatedAt:{
                 type: Date,
                 default: Date
                }
              },
        ],
        deleted: {
            type: Boolean,
            default: false
        },
        deletedBy:{
                account_id: String,
                deletedAt:Date
            }
        

    }, 
);
const Product = mongoose.model('Product', productSchema, "products");

module.exports = Product;
