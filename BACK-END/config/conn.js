const mongoose = require('mongoose');
mongoose.connect(process.env.DEV_DB_CONN, {
  
 
}).then(() => {
    console.log("DB connected successfully...");
}).catch((err) => {
    console.log(`some error occurs ${err}`);
})