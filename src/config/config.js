

// EK DOSYALAR

const dotenv=require('dotenv');
dotenv.config();

module.exports={
    port:process.env.PORT || 3000,
    mongodbUri:process.env.MONGODB_URI,
    jwtSecret:process.env.JWT_SECRET || 'your_jwt_secret_key',
    nodeEnv:process.env.NODE_ENV || 'development',
    jwtExpiresIn:'1d' // JWT token'larının geçerlilik süresi (1 gün)
};