

class Product{
    constructor(id,name,price,description,category){
        this.id=id;
        this.name=name;
        this.price=price;
        this.description=description;
        this.category=category;
    }

    applyDiscount(percentage){
        this.price=this.price -(this.price * (percentage/100));
    }

    toJSON(){
        return{
            id:this.id,
            name:this.name,
            price:this.price,
            description:this.description,
            category:this.category
        };
    }
}

module.exports=Product;