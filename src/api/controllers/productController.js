

const productService=require('../../services/productService');

class ProductController{

    //============================================
    async getAllProducts(req,res,next){
        try{
            const product=await productService.getAllProducts();
            res.status(200).json(product);
        }catch(error){
            console.error('Error fetching products:',error);
            next(error);
        }
    }
    //============================================
    async getProductById(req,res,next){
        try{
            const product=await productService.getProductById(req.params.id);
            res.status(200).json(product);
        }catch(error){
            next(error);
        }
    }
    //============================================
    async getProductByCategory(req,res,next){
        try{
            const products=await productService.getProductsByCategory(req.params.category);
            res.status(200).json(products);
        }catch(error){
            next(error);
        }
    }
    //============================================
    async createProduct(req,res,next){
        try{
            const product=await productService.createProduct(req.body);
            res.status(200).json(product);
        }catch(error){
            next(error);
        }
    }
    //============================================
    async updateProduct(req,res,next){
        try{
            const product=await productService.updateProduct(req.params.id,req.body);
            res.status(200).json(product);
        }catch(error){
            next(error);
        }
    }
    //============================================
    async deleteProduct(req,res,next){
        try{
            const result=await productService.deleteProduct(req.params.id);
            res.status(200).json(result);
        }catch(error){
            next(error);
        }
    }
    //============================================
}
module.exports=new ProductController();