

// Bu kısımda bir token şeması oluşturalım.
const mongoose = require('mongoose');


const tokenSchema = new mongoose.Schema({
  // Token'ın kendisi
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  
  // Token'ın ait olduğu kullanıcı (referans)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Token'ın tipi (access, refresh vb.)
  type: {
    type: String,
    enum: ['access', 'refresh'],
    default: 'access'
  },
  
  // Token'ın oluşturulma tarihi
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  // Token'ın geçerlilik süresi
  expiresAt: {
    type: Date,
    required: true
  },
  
  // Token geçersiz kılındı mı?
  isRevoked: {
    type: Boolean,
    default: false
  },
  
  // Ek kullanıcı bilgileri (hızlı erişim için)
  userEmail: {
    type: String
  },
  
  userRole: {
    type: String
  },
  
  // Kullanıcı aygıt bilgileri (isteğe bağlı)
  deviceInfo: {
    ip: String,
    userAgent: String,
    deviceType: String
  },
  
  // Son kullanım tarihi (isteğe bağlı)
  lastUsedAt: {
    type: Date
  }
});

// Süresi dolmuş token'ları bulmak için index
tokenSchema.index({ expiresAt: 1 });

// Kullanıcıya ait token'ları bulmak için index
tokenSchema.index({ userId: 1 });

// Süresi dolmuş token'ları temizlemek için metod
tokenSchema.statics.removeExpiredTokens = async function() {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

// Kullanıcıya ait tüm token'ları geçersiz kılmak için metod
tokenSchema.statics.revokeAllUserTokens = async function(userId) {
  return this.updateMany(
    { userId, isRevoked: false },
    { $set: { isRevoked: true } }
  );
};

const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;
