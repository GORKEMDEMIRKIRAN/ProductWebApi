


const tokenRepository=require('../data/repositories/tokenRepository');

class tokenService{


    //=======================================
    async getAllTokens(){
        return await tokenRepository.findAll();
    }
    //=======================================
    async countToken(){
        return await tokenRepository.countToken();
    }
    //=======================================
    async insertManyTokens(tokenData){
        return await tokenRepository.insertAllToken(tokenData);
    }
    //=======================================
}


module.exports=new tokenService();