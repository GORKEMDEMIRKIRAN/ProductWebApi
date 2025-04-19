


const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().min(2).max(100).required()
    .messages({
      'string.min': 'Ürün adı en az 2 karakter olmalıdır',
      'string.max': 'Ürün adı en fazla 100 karakter olmalıdır',
      'any.required': 'Ürün adı zorunludur'
    }),
  price: Joi.number().min(0).required()
    .messages({
      'number.min': 'Fiyat 0\'dan küçük olamaz',
      'any.required': 'Fiyat alanı zorunludur'
    }),
  description: Joi.string().min(10).required()
    .messages({
      'string.min': 'Açıklama en az 10 karakter olmalıdır',
      'any.required': 'Açıklama alanı zorunludur'
    }),
  category: Joi.string().required()
    .messages({
      'any.required': 'Kategori alanı zorunludur'
    })
});

const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body, { abortEarly: false });
  
  if (error) {
    const errorMessages = error.details.map(detail => detail.message);
    return res.status(400).json({ errors: errorMessages });
  }
  
  next();
};

module.exports = { validateProduct };
