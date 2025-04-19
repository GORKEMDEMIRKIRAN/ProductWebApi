

// KIMLIK DOĞRULAMA MIDDLEWARE ANALIZI

/*

Bu kod, JSON Web Token'ları (JWT) kullanarak bir Node.js uygulaması 
için kimlik doğrulama middleware fonksiyonlarını tanımlar. 



Bu, ana kimlik doğrulama middleware'idir ve şunları yapar:
  1-Authorization başlığından JWT token'ı çıkarır
  2-Token'ın geçerliliğini doğrular
  3-Çözümlenmiş kullanıcı bilgilerini istek nesnesine ekler


Fonksiyonun akışı:
  Hata ayıklama için istek başlıklarını loglar
  Authorization başlığının var olup olmadığını ve "Bearer token" formatını takip edip etmediğini kontrol eder
  Başlık dizesini bölerek token'ı çıkarır
  JWT_SECRET ortam değişkenini kullanarak token'ı doğrular
  Çözümlenmiş kullanıcı bilgilerini istek nesnesine ekler
  Bir sonraki middleware veya rota işleyicisine geçmek için next() fonksiyonunu çağırır


Herhangi bir hata oluşursa (eksik token, geçersiz token, süresi dolmuş token), 401 Unauthorized yanıtı döndürür.


Güvenlik Hususları
  Kod, JWT gizli anahtarı için ortam değişkenlerini uygun şekilde kullanır
  Hata ayıklama için detaylı loglama içerir, ancak bu üretim ortamında hassas bilgileri açığa çıkarabilir
  Uygun durum kodlarını döndürür (kimlik doğrulama sorunları için 401, yetkilendirme sorunları için 403)
 */

const jwt = require('jsonwebtoken');
const userService = require('../../services/userService');


//=======================================================
const authMiddleware = async (req, res, next) => {
  try {
    console.log('Auth middleware running for path:', req.path);
    console.log('Auth headers:', req.headers);
    // Get token from header
    // Authhorization header'ı kontrol et
    const authHeader=req.headers.authorization;
    console.log('Authorization header:', authHeader);

    if(!authHeader || !authHeader.startsWith('Bearer ')){
      console.log('No valid authorization header found');
      return res.status(401).json({message:"Authentication required"});
    }
    
    // Token'ı çıkar
    const token=authHeader.split(' ')[1];
    console.log('Token extracted:', token ? 'Token exists' : 'No token');
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token decoded successfully:', decoded);

    // Kullanıcı bilgilerini request nesnesine ekle
    req.user = decoded;
    //console.log('User set in request:', req.user);

    next();


  } catch (error) {
      console.error('Auth middleware error:', error);
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

//=======================================================
//Bu middleware, kimliği doğrulanmış kullanıcının admin yetkilerine sahip olup olmadığını kontrol eder:
const adminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};
//=======================================================
module.exports = {
  authMiddleware,
  adminMiddleware
};
//=======================================================