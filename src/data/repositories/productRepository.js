


const ProductModel=require('../models/productModel');
const Product=require('../../models/Product');



class productRepository {

    //===================================================
    async findAll(){
        const products=await ProductModel.find({});
        return products.map(product=>new Product(
            product._id.toString(),
            product.name,
            product.price,
            product.description,
            product.category
        ));
    }
    //===================================================
    async findById(id){
        const product=await ProductModel.findById(id);
        if(!product)
        {
            return null;
        }
        return new Product(
            product._id.toString(),
            product.name,
            product.price,
            product.description,
            product.category
        );
    }
    //===================================================
    async findByCategory(category){
        const products=await ProductModel.find({category});
        return products.map(product=>new Product(
            product._id.toString(),
            product.name,
            product.price,
            product.description,
            product.category
        ));
    }
    //===================================================
    async create(productData) {
        const product = await ProductModel.create(productData);
        
        return new Product(
            product._id.toString(),
            product.name,
            product.price,
            product.description,
            product.category
        );
    }
    //===================================================
    async update(id, productData) {
        const product = await ProductModel.findByIdAndUpdate(id, productData, { new: true });
        if (!product) return null;
        
        return new Product(
            product._id.toString(),
            product.name,
            product.price,
            product.description,
            product.category
        );
    }
        //===================================================
    async delete(id) {
        const product = await ProductModel.findByIdAndDelete(id);
        return !!product;
    }
    //===================================================
    async countAllProducts(){
        return await ProductModel.countDocuments({});
    }
    //===================================================
    async insertAllProducts(products){
        const result=await ProductModel.insertMany(products);
        return result;
    }
    //===================================================
}

module.exports=new productRepository();