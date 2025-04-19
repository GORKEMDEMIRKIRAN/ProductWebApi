

const productRepository=require('../data/repositories/productRepository');

class ProductService{

    //===========================================
    async getAllProducts(){
        return await productRepository.findAll();
    }
    //===========================================
    async getProductById(id){
        const product=await productRepository.findById(id);
        if(!product){
            throw new Error('Product not found');
        }
        return product;
    }
    //===========================================
    async getProductsByCategory(category){
        return await productRepository.findByCategory(category);
    }
    //===========================================
    async createProduct(productData){
        return await productRepository.create(productData);
    }
    //===========================================
    async updateProduct(id,productData){
        const product=await productRepository.update(id,productData);
        if(!product){
            throw new Error("Product not found");
        }
        return product;
    }
    //===========================================
    async deleteProduct(id){
        const result=await productRepository.delete(id);
        if(!result){
            throw new Error('Product not found');
        }
        return {success:true,message:'Product deleted successfully'};
    }
    //===========================================
    async countAllProducts(){
        return await productRepository.countAllProducts();
    }
    //===========================================
    async insertManyProducts(products){
        return await productRepository.insertAllProducts(products);
    }
    //===========================================

}

module.exports= new ProductService();