const mongoose = require('mongoose');
const mongodb=async()=>{
    mongoose.connect('mongodb://127.0.0.1:27017/Food-app').then(() => {
    console.log("Database is connected");
}).catch(error => {
    console.error("Database connection error:", error);
});
}
module.exports=mongodb;