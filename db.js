const mongoose= require('mongoose');    
const url= 'mongodb+srv://adityagupta630639:NOntJZEv9zYSINzt@portfolio-aditya.ypnbkip.mongodb.net/portfolio-aditya?retryWrites=true&w=majority&appName=portfolio-aditya';
const connectDB = async () => {
    try {
        await mongoose.connect(url); 
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit the process with failure
    }
}
module.exports = connectDB;