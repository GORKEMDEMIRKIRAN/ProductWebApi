

// bu kod bir MongoDB veritabanı için Mongoose kullanarak bir kullanıcı (User) şeması ve modeli oluşturuyor.

// name: Kullanıcı adı (zorunlu)
// email: E-posta adresi (zorunlu, benzersiz)
// password: Şifre (zorunlu)
// role: Kullanıcı rolü ('user' veya 'admin', varsayılan 'user')
// createdAt: Oluşturulma tarihi (varsayılan olarak şu anki tarih)


const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,  // benzersiz
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'  // varasyılan user
    },
    createdAt:{
        type:Date,
        default:Date.now
    }

});


const userModel=mongoose.model('User',userSchema);

module.exports=userModel;