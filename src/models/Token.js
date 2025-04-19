



class Token{


    constructor(id,token,userId,type,createdAt,expiresAt,userEmail,userRole){
        this.id=id;
        this.token=token;
        this.userId=userId;
        this.type=type;
        this.createdAt=createdAt;
        this.expiresAt=expiresAt;
        this.userEmail=userEmail;
        this.userRole=userRole;
    }

    toJSON(){
        return{
            id:this.id,
            token:this.token,
            userId:this.userId,
            type:this.type,
            createdAt:this.createdAt,
            expiresAt:this.expiresAt,
            userEmail:this.userEmail,
            userRole:this.userRole
        }
    }

}

module.exports=Token;