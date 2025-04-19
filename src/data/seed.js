
const productService=require('../services/productService');
const userService=require('../services/userService');
const tokenService=require('../services/tokenService');

// şifre hash ekleme
const {doHash}=require('./hash');
// token oluşturma
const {createToken}=require('./token');

const productList=[
    {name:'samsung S5',price:3500,description:'good phone',category:'phone'},
    {name:'samsung 6',price:4500,description:'good phone',category:'phone'},
    {name:'samsung S8',price:5500,description:'good phone',category:'phone'},
    {name:'samsung 15',price:6500,description:'good phone',category:'phone'},
    {name:'samsung S32',price:7500,description:'good phone',category:'phone'},
    {name:'samsung A55',price:3500,description:'good phone',category:'phone'},
    {name:'samsung aS5',price:9500,description:'good phone',category:'phone'},
]

const userList=[
    {name:'grkm',email:'grkm@example.com',password:'123456',role:'admin',createdAt:Date.now()},
    {name:'tutu',email:'tutu@example.com',password:'123456',role:'user',createdAt:Date.now()}
]


// VERİ TABANINA TOPLU ÜRÜN EKLEME
async function seedProducts(){
    try{
        const count=await productService.countAllProducts();
        if(count === 0){
            await productService.insertManyProducts(productList);
            console.log('Ürün tablosu boştu,hazır veri eklendi');
        }else{
            console.log('Ürün tablosunda zaten veri var,seed işlemi atlandı');
        }
    }catch(err){
        console.log('Hazır Product verisi eklenirken sorun oluştur:',err);
    }
}
// VERİ TABANINA TOPLU KULLANICI EKLEME
async function seedUsers(){
    try{
        const count=await userService.countAlluser();
        if(count===0){
            // Şifre hash'leme
            const hashedUsers=await Promise.all(userList.map(async(user)=>{
                return{
                    ...user,
                    password:await doHash(user.password)
                };
            }));
            // haslenmiş kullanıcı verilerini database ekleme
            await userService.insertManyUser(hashedUsers);
            console.log('Kullanıcı tablosu boştu, veri eklendi');
        }else{
            console.log('Kullanıcı tablosunda veri var ,seed işlemi atlandı.');
        }
    }catch(err){
        console.log('Hazır kullanıcı verisi eklenirken sorun oluştu:',err);
    }
}
// VERİ TABANINA TOPLU TOKEN EKLEME
async function seedTokens(){
    try{
        const count=await tokenService.countToken();
        if(count===0){
            // önce kullanıcılaro oluşturup ID'lerini alalım
            /* 
                Unutma !!!!
                seedTokens önce seedUsers eklemen lazım
                Sıraya dikkat et
            */
            const users=await userService.getAllUsers();
            if(users.length < 2){
                console.log('Kullanıcılar henüz oluşmamış,önce kullanıcıları oluştur.');
                return;
            }
            
            //==========================================================
            // Token'ları oluşturalım.
            const adminUser=users.find(user=>user.role==='admin');
            const regularUser=users.find(user=>user.role==='user');
            console.log('Admin kullanıcısı: ',adminUser);
            console.log('Regular kullanıcısı: ',regularUser);

            if(!adminUser || !regularUser){
                console.log('Admin ve normal kullanici bulunamadi');
                return;
            }
            if(!adminUser.id && !adminUser._id){
                console.log('Admin kullanicisinin ID si bulunamadi');
                return;
            }
            if(!regularUser.id && !regularUser._id){
                console.log('Regular kullanicisinin Id si bulunamadi');
                return;
            }
            // ID 'yi doğru şekilde alalım.
            const adminId=adminUser.id||(adminUser._id?adminUser._id.toString():null);
            const userId=regularUser.id||(regularUser._id?regularUser._id.toString():null);
            if(!adminId || !userId){
                console.log('Kullanıcı Id leri alinamadi');
                return;
            }

            const adminToken=await createToken(adminId,adminUser.email,adminUser.role);
            const regularToken=await createToken(userId,regularUser.email,regularUser.role);

            // Token list
            const tokenList=[
                {
                    token:adminToken,
                    userId:adminUser._id || adminUser.id,
                    type:'access',
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 10*60*60*1000),// 10 hours,
                    isRevoked:false,
                    userEmail:adminUser.email,
                    userRole:adminUser.role
                },
                {
                    token:regularToken,
                    userId:regularUser._id || regularUser.id,
                    type:'access',
                    createdAt:new Date(),
                    expiresAt: new Date(Date.now() + 10*60*60*1000), // 10 hours,
                    isRevoked:false,
                    userEmail:regularUser.email,
                    userRole:regularUser.role
                }
            ];
            //==========================================================
            // Daha sonra listeyi veritabanına ekleme
            await tokenService.insertManyTokens(tokenList);
            console.log('Kullanıcı token lsitesi boş,veri eklendi');
        }else{
            console.log('Kullanıcı token listesi ekli,seed işlemi atlandı');
        }
    }catch(err){
        console.log('Token verileri eklenirken hata oluştu: ',err);
        console.error(err);
    }
}

module.exports={seedProducts,seedUsers,seedTokens};
