

const Joi=require('joi');

// kullanıcı şeması tanımı - doğrulama kurallarını içerir
const userSchema=Joi.object({

    name:Joi.string().min(3).max(50).required()
        .messages({
            'string.min':'İsim en az 3 karakter olmalıdır',
            'string.max':'İsim en fazla 50 karakter olmalıdır',
            'any.required':'İsim alanı zorunludur'
        }),
    email:Joi.string().email().required()
        .messages({
            'string.email':'Geçerli bir e-posta adresi giriniz',
            'any.required':'E-posta alanı zorunludur'
        }),
    password:Joi.string().min(6).required()
        .messages({
            'string.min':'Şifre en az 6 karakter olmalıdır',
            'any.required':'Şifre alanı zorunludur'
        }),
    role:Joi.string().valid('user','admin').default('user')
        .messages({
            'any.only':'Rol sadece "user" veya "admin" olabilir'
        })
});


// Express middleware olarak kullanılacak validator fonksiyonu
const validateUser=(req,res,next)=>{
    // abortEarly: false - tüm hataları topla, ilk hatada durma
    const {error}=userSchema.validate(req.body,{abortEarly:false});

    if(error){
        // Hata varsa, hata mesajlarını bir diziye dönüştür
        const errorMessages=error.details.map(detail=>detail.message);
        // 400 Bad Request hatası ile hata mesajlarını döndür
        return res.status(400).json({errors:errorMessages});
    }
    // Hata yoksa bir sonraki middleware'e geç
    next();
};

module.exports={validateUser};