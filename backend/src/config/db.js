import mongoose from 'mongoose';

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);

        console.log("lien ket DB thanh cong");
    } catch (error) {
        console.error("loi khi connect DB: ", error);
        process.exit(1); //1 mean exit with error 
    }
}