


/*
Bu kod, bir Repository Pattern uygulamasının bir parçasıdır. 
Repository Pattern, veri erişim katmanını soyutlamak için kullanılan bir tasarım desenidir.

 */

const UserModel = require('../models/userModel');   // MongoDB şeması/modeli
const User = require('../../models/User'); // Domain/Entity modeli


class UserRepository{

    //===============================================================
    async findAll(){
        //MongoDB'den tüm kullanıcıları getir, şifre alanını hariç tut
        const users=await UserModel.find({}).select('-password');
        // MongoDB modellerini domain modellerine dönüştür
        return users.map(user=>new User(
            user._id.toString(),
            user.name,
            user.email,
            user.role,
            user.password
        ));
    }
    //===============================================================
    async findByEmail(email){
        const user=await UserModel.findOne({email});
        if(!user){
            return null;
        }
        return new User(
            user._id.toString(),
            user.name,
            user.email,
            user.role,
            user.password
        );
    }
    //===============================================================
    async findById(id){
        const user=await UserModel.findOne({id});
        if(!user){
            return null;
        }
        return new User(
            user._id.toString(),
            user.name,
            user.email,
            user.role,
            user.password
        );
    }
    //===============================================================
    async create(userData){
        const user=await UserModel.create(userData);
        if(!user){
            return null;
        }
        return new User(
            user._id.toString(),
            user.name,
            user.email,
            user.role,
            user.password
        );
    }
    //===============================================================
    async update(id,userData){
        const user=await UserModel.findByIdAndUpdate(id,userData,{new:true}).select('-password');
        if(!user){
            return null;
        }
        return new User(
            user._id.toString(),
            user.name,
            user.email,
            user.role,
            user.password
        );
    }
    //===============================================================
    async delete(id){
        const user=await UserModel.findByIdAndDelete(id);
        return !!user;   
    }
    //===============================================================
    async countUsers(){
        return await UserModel.countDocuments({});
    }
    //===============================================================
    async insertAllUsers(userData){
        const result=await UserModel.insertMany(userData);
        return result;
    }
    //===============================================================
}
module.exports=new UserRepository();




/*

1-İki farklı model içe aktarılıyor:
    UserModel: MongoDB ile etkileşim için kullanılan Mongoose modeli (veritabanı şeması)
    User: Uygulama içinde kullanılan domain/entity modeli (iş mantığı için)

2- UserRepository sınıfı, veritabanı işlemlerini soyutlamak için oluşturulmuş.


3- findAll() metodu:
    MongoDB'den tüm kullanıcıları çeker (UserModel.find({}))
    Güvenlik için şifre alanını hariç tutar (.select('-password'))
    Veritabanından gelen her kullanıcı belgesini, uygulama içinde kullanılacak User domain modeline dönüştürür
    MongoDB'nin _id değerini string'e çevirip, diğer gerekli alanlarla birlikte yeni bir User nesnesi oluşturur
 */



/*
Bunlar mongoosee sağladığı sorgu metotları

Mongoose Sorgu Metodları


    find({})
    Belirtilen kriterlere uyan tüm belgeleri döndürür
    Örnek: UserModel.find({}) - tüm kullanıcıları getirir
    Örnek: UserModel.find({role: 'admin'}) - sadece admin rolündeki kullanıcıları getirir

    
    findOne({})
    Belirtilen kriterlere uyan ilk belgeyi döndürür
    Örnek: UserModel.findOne({email: 'test@example.com'}) - bu e-postaya sahip ilk kullanıcıyı getirir


    findById(id)
    Belirtilen ID'ye sahip belgeyi döndürür
    Örnek: UserModel.findById('60d21b4667d0d8992e610c85') - bu ID'ye sahip kullanıcıyı getirir
    Bu aslında findOne({ _id: id }) ile aynıdır, sadece daha kısa bir yazım şeklidir


    findByIdAndUpdate(id, update, options)
    Belirtilen ID'ye sahip belgeyi bulur ve günceller
    Parametreler:
    id: Güncellenecek belgenin ID'si
    update: Güncellenecek alanlar ve değerleri
    options: Güncelleme seçenekleri (örn. {new: true} güncellenmiş belgeyi döndürür)
    Örnek: UserModel.findByIdAndUpdate('60d21b4667d0d8992e610c85', {name: 'Yeni İsim'}, {new: true})


    findByIdAndDelete(id)
    Belirtilen ID'ye sahip belgeyi bulur ve siler
    Örnek: UserModel.findByIdAndDelete('60d21b4667d0d8992e610c85')
 */