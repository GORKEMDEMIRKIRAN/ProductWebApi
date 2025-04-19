

// Burada şifre hashleme fonksiyonu yazalım

const mongoose=require('mongoose');
//const bcrypt=require('bcrypt');
const bcryptjs=require('bcryptjs');


async function doHash(password){
    // dışarıdan parola verilir
    // çıktı şifre hashlenmiş olarak verilir.

    const salt=await bcryptjs.genSalt(10);
    const psw=await bcryptjs.hash(password,salt);
    return psw;
}

module.exports={
    doHash
}