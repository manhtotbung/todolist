import bcrypt from 'bcrypt';
import crypto from "crypto";
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Session from '../models/Session.js';

const ACCESS_TOKEN_TTL = '15m'; //thoi gian song cua access token
const REFRESH_TOKEN_TTL = 7*24*60*60*1000; //thoi gian song cua refresh token

export const signUp = async(req, res) => {
    // Sign up logic here
    try {
        const { username, password, email, firstName, lastName } = req.body;

        if (!username || !password || !email || !firstName || !lastName) {
            return res.status(400).json({ message: "khong the thieu username, password, firstname, lastname." });
        }

        //kiem tra user da ton tai chua
        const duplicate = await User.findOne({ username });
        if(duplicate){
            return res.status(409).json({ message: "username da ton tai" });
        }

        //ma hoa password
        const hashedPassword = await bcrypt.hash(password, 10); //10 la so lan bam(salt rounds)

        //luu user vao db
        await User.create({
            username,
            hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`
        });
        
        //tra ve ket qua
        res.status(201).json({ message: "tao tai khoan thanh cong" });
    } catch (error) {
        console.error("loi khi dang ky: ", error);
        res.status(500).json({ message: "loi server" });
    }

}

export const signIn = async(req, res) => {
    // Sign in logic here
    try {
        //lấy input
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "khong the thieu username va password." });
        }
        //lấy hashedpassword trong db để so sánh với password người dùng nhập vào
        const user = await User.findOne({ username });
        if(!user){
            return res.status(401).json({ message: "Sai ten dang nhap hoac mat khau" });
        }

        //so sánh password
        const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
        if(!passwordCorrect){
            return res.status(401).json({ message: "Sai ten dang nhap hoac mat khau" });
        }
        
        //nếu khớp thì tạo accesstoken với jwt
        const accessToken = jwt.sign(
            {userId: user._id},
             process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn: ACCESS_TOKEN_TTL });
        
        //tạo refresh token với jwt
        const refreshToken = crypto.randomBytes(64).toString("hex");

        //tạo session moi de lưu refresh token 
        await Session.create({
            userId: user._id,
            refreshToken: refreshToken,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL) //7 ngay
        });

        //trả về refresh trong cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none', //backend va frontend khac domain deloy rieng
            maxAge: REFRESH_TOKEN_TTL
        });
        
        //trả access token về trong res 
        res.status(200).json({message: `user ${user.displayName} logged in`, accessToken });
        
    } catch (error) {
        console.error("loi khi goi signIn: ", error);
        res.status(500).json({ message: "lỗi server" });
    }
}

export const signOut = async(req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if(token){
            //xoa refreash token trong db
            await Session.deleteOne({refreshToken: token});
            //xoa cookie tren trinh duyet
            res.clearCookie('refreshToken');
        }
        return res.sendStatus(204);
    } catch (error) {
        console.error("loi khi goi signOut: ", error);
        res.status(500).json({ message: "lỗi server" });   
    }
}