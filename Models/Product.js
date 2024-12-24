import mongoose from "mongoose";

const schema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    stock : {
        type : Number,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    image : {
        type : String,
        required : true,
    },
   
    category : {
        type : String,
        required : true,
    },
    brand : {
        type : String,
        required : true,
        },
    type : {
            type : String,
            required : true,
            },

    createdAt : {
        type : Date,
        default : Date.now(),
    },

});



export const Product = mongoose.model("Product1" , schema)