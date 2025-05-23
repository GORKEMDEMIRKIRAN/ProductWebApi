



// name: Ürün adı (zorunlu, boşluklar temizlenir)
// price: Ürün fiyatı (zorunlu, minimum değer 0)
// description: Ürün açıklaması (zorunlu)
// category: Ürün kategorisi (zorunlu, boşluklar temizlenir)
// createdAt: Oluşturulma tarihi (varsayılan olarak şu anki tarih)



const mongoose=require('mongoose');

const productSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

});
const ProductModel=mongoose.model('Product',productSchema);

module.exports=ProductModel;