import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    hashedPassword: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,  
        unique: true,
        trim: true,
        lowercase: true
    },
    displayName: {
        type: String,
        require: true,
        trim: true
    },
    avatarUrl: {
        type: String, //link cdn de hien thi anh dai dien
    },
    avatarId: {
        type: String, //id anh tren cloudinary de xoa hinh
    },
    bio:{
        type: String,
        maxlength: 500
    },
    phone:{
        type: String,
        sparse: true //cho phep mull nhung khong duoc trung
    },
   
}, {
    timestamps: true,
    //true không phải là một field trong document, mà là tùy chọn của schema, giúp Mongoose tự động thêm hai cột ẩn: createdAt và updatedAt vào mỗi document khi được tạo hoặc cập nhật.
});

const User = mongoose.model('User', userSchema);

export default User;