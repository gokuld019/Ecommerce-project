import mongoose from 'mongoose';

const BuyNowSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    userEmail:  {
        type: String,
        required: true,
    },
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product1' 
    },
    productName:  {
        type: String,
        required: true,
    },
    productPrice:  {
        type: Number,
        required: true,
    },
    purchaseDate: { 
        type: Date, 
        default: Date.now 
    }
  
});

export const BuyNow = mongoose.model("BuyNow",BuyNowSchema)