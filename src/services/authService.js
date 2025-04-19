
// const bcrypt = require('bcrypt');

const userRepository = require('../data/repositories/userRepository');
const tokenRepository=require('../data/repositories/tokenRepository');
const {createToken}=require('../data/token'); // token oluşturma metodu
const {doHash}=require('../data/hash'); // token hashleme
const bcryptjs=require('bcryptjs');

class AuthService {

  //=================================================
  async login(email, password) {
    //=====================================
    // Kullanıcıyı e-posta ile bul
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new Error('Böyle bir kullanici yok');
    }
    console.log("Giriş yapan kullanici: ",user);
    //=====================================
    // user içinden şifreyi kontrol et
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Yanliş şifre');
    }
    //=====================================
    // token kontrolü ve yönetimi
    const tokenData=await tokenRepository.findById(user.id);
    // Eğer token yoksa ve süresi dolmuşsa yeni token oluştur
    // database ekleme
    if(!tokenData){
        throw new Error('Böyle bir token bulunamadı');
    }
    if(tokenData.expiresAt>Date.now()){
      // token süresi geçerli ise
      console.log('Bulunan token: ',tokenData);
      //==========================
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          password:user.password
        },
        tokenList:{
          token:tokenData.token,
          userId:tokenData.userId
        }
      };
      //==========================
    }else{
      // token süresi dolmuşsa
    
      // new token code create
      const newTokenCode=await createToken(user.id,user.email,user.role);
      console.log('Oluşturulan token: ',newTokenCode);
      // token delete
      // user.id göre token silme işlemi
      await tokenRepository.deleteToken(user.id);
      // token database add
      await tokenRepository.addToken( {
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
    
  }
  //=================================================
  async register(userData) {
    // E-posta kontrolü
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Bu e-posta adresi zaten kullanılıyor');

    }
    
    //password hash
    //const salt = await bcrypt.genSalt(10);
    //const hashedPassword = await bcrypt.hash(userData.password, salt);
    const hashedPassword=await doHash(userData.password);
    // create user
    const user = await userRepository.create({
      ...userData,
      password: hashedPassword
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
  //=================================================
  // Yardımdı Fonksiyonlar
  //=================================================

}

module.exports = new AuthService();
