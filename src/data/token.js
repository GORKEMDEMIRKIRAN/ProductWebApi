

// Bu kısımda token oluşturan fonksiyonu yazalım.


const jwt=require('jsonwebtoken');
const config=require('../config/config');


// Dışarıdan gelen kullanıcı bilgileri alıp bir token oluşturup içine
// kullanıcı bigilerini ekliyor.
async function createToken(userId,userEmail,userRole){
    const token=jwt.sign(
        {
            userId:userId,
            role:userRole,
            userEmail:userEmail
        },
        config.jwtSecret,
        {
            expiresIn:config.jwtExpiresIn
        }
    )
    return token;
}

module.exports={
    createToken
}