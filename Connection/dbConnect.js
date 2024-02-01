const mongoose = require("mongoose");

const dbConnect = async () => {
   try {
       const conn = await mongoose.connect(process.env.MONGO_URI)
       console.log("Database connected successfully");
   } catch (error) {
    console.log(error);
   }
}

module.exports = dbConnect;