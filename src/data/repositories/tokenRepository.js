


const UserToken=require('../models/userToken');
const Token=require('../../models/Token');

class tokenRepository{

    //================================================
    async findAll(){
        const tokenList=await UserToken.find({});
        return tokenList.map(token=> new Token(
            token.id.toString(),
            token.token,
            token.userId,
            token.type,
            token.userEmail,
            token.userRole
        ));
    }
    //================================================
    async findById(userId){
        const token= await UserToken.findOne({userId});
        if(!token){
            return null;
        }
        return new Token(
            //token._id.toString(),
            token.id,
            token.token,
            token.userId,
            token.type,
            token.createdAt,
            token.expiresAt,
            token.userEmail,
            token.userRole
        );
    }
    //================================================
    async countToken(){
        return await UserToken.countDocuments({});
    }
    //================================================
    async insertAllToken(tokenData){
        const result=await UserToken.insertMany(tokenData);
        return result;
    }
    //================================================
    // token create
    async addToken(tokenData){
        return await UserToken.create(tokenData);
    }
    //================================================
    // token delete with tokenId
    async deleteToken(userId){
        const result=await UserToken.deleteOne({userId});
        return result;
    }
    //================================================
    async update(id,tokenData){
        
    }
    //================================================

}

module.exports= new tokenRepository();