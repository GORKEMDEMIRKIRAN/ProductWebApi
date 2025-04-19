

const Joi = require('joi');


const loginSchema = Joi.object({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Geçerli bir e-posta adresi giriniz',
        'any.required': 'E-posta alanı zorunludur'
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Şifre alanı zorunludur'
      })
  });
  
  const validateLogin = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errorMessages = error.details.map(detail => detail.message);
      return res.status(400).json({ errors: errorMessages });
    }
    
    next();
  };


module.exports={validateLogin};