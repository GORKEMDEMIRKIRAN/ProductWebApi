

const userService=require('../../services/userService');
// Kullanıcı güncelleme için şifre hashleme
const {doHash}=require('../../data/hash');

class UserController{

    //=================================================
    async getAllUsers(req,res,next){
        try{
            const users=await userService.getAllUsers();
            res.status(200).json(users);
        }catch(error){
            next(error);
        }
    }
    //=================================================
    async getUserById(req,res,next){
        try{
            const user=await userService.getUserById(req.params.id);
            res.status(200).json(user);
        }catch(error){
            next(error);
        }
    }
    //=================================================
    async getUserByEmail(req,res,next){
        console.log('email bulma');
        try{
            const user=await userService.getUserByEmail(req.params.email);
            console.log(req.params.email);
            res.status(200).json(user);
        }catch(error){
            next(error);
        }
    }
    //=================================================
    async createUser(req,res,next){
        try{
            const user=await userService.createUser(req.body);
            res.status(201).json(user);
        }catch(error){
            next(error);
        }
    }
    //=================================================
    async updateUser(req,res,next){
        try{
            // şifre hashleme
            // id ve body kısmındaki data güncelleme
            req.body.password=await doHash(req.body.password);
            const user=await userService.updateUser(req.params.id,req.body);
            res.status(200).json(user);
        }catch(error){
            next(error);
        }
    }
    //=================================================
    async deleteUser(req,res,next){
        try{
            const result=await userService.deleteUser(req.params.id);
            res.status(200).json(result);
        }catch(error){
            next(error);
        }
    }
    //=================================================
}

module.exports=new UserController();