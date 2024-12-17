const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((conn) => {
      console.log(`Database connected on: ${conn.connection.host}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDB;
