

// data katmanına bağlanıp sorguları burada yöeneteceğiz

const userRepository=require('../data/repositories/userRepository');
const tokenRepository=require('../data/repositories/tokenRepository');
const {createToken}=require('../data/token'); // token oluşturma metodu
const {doHash}=require('../data/hash'); // token hashleme

class UserService{
    
    //==============================================
    async getAllUsers(){
        return await userRepository.findAll();
    }
    //==============================================
    async getUserById(id){
        // Eğer user yoksa null döndürecek "userRepository" yoksa null
        // döndürdüm burada kullanıcı yoksa mesaj veriyorum.
        const user= await userRepository.findById(id);
        if(!user){
            return new Error("User not found");
        }
        return user;
    }
    //==============================================
    async getUserByEmail(email){
        const user= await userRepository.findByEmail(email);
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }
    //==============================================
    async createUser(userData){
        // email ile kullanıcıyı kontrol etme 
        // Kullanıcı varsa yenisini oluşturmayacak yoksa oluşturacaktır.
        const existingUser=await userRepository.findByEmail(userData.email);
        if(existingUser){
            throw new Error("Bu e-posta adresi zaten kullanılıyor");
        }
        
        // password hash
        //const salt=await bcrypt.genSalt(10);
        //const hashedPassword=await bcrypt.hash(userData.password,salt);
        const hashedPassword=await doHash(userData.password);
        // create user
        const user=await userRepository.create({
            ...userData,
            password:hashedPassword
        });
        // token create
        const newTokenCode=await createToken(user.id,user.email,user.role);
        // token database add
        await tokenRepository.addToken(
                        {
                            token:newTokenCode,
                            userId:user.id,
                            type:'access',
                            createdAt: new Date(),
                            expiresAt: new Date(Date.now()+10*60*60*1000), // 10 hours
                            isRevoked:false,
                            userEmail:user.email,
                            userRole:user.role
                        }
        );
        return {
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              password:user.password
            },
            tokenList:{
              token:newTokenCode,
              userId:user.id
            }
        };
    
    }
    //==============================================
    async updateUser(id,userData){
        const user=await userRepository.update(id,userData);
        if(!user){
            throw new Error("User not found");
        }
        return user;
    }
    //==============================================
    async deleteUser(id){
        // eğer kullanıcı varsa silinir ve null döner
        // user yoksa zaten 
        const result=await userRepository.delete(id);
        if(!result){
            throw new Error("User not found");
        }
        return {seuccess:true,message:'User deleted successfully'};
    }
    //==============================================
    async countAlluser(){
        return await userRepository.countUsers();
    }
    //==============================================
    async insertManyUser(userData){
        return await userRepository.insertAllUsers(userData);
    }
    //==============================================

}

module.exports= new UserService();