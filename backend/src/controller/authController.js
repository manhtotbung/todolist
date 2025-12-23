import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Crypto from "crypto";
import Session from "../models/Session.js";

const ACCESS_TOKEN_TTL = '30m';
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; //14 ngay theo miliseconds vi mongodb su dung don vi giay

export const signUp = async (req, res) => {
   try {
      const { username, password, email, firstName, lastName } = req.body;

      if (!username || !password || !email || !firstName || !lastName) {
         return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin." });
      }

      // Kiểm tra nếu username hoặc email đã tồn tại
      const existingUser = await User.findOne({username});
      if (existingUser) {
         return  res.status(409).json({ message: "Tên đăng nhập đã được sử dụng." });
      }
      //ma hoa mat khau
      const hashedPassword = await bcrypt.hash(password, 10); //salt = 10 vong
      
      //tao nguoi dung moi va luu vao db
      await User.create(
         {
            username,
            hashedPassword: hashedPassword,
            email,
            displayName: `${firstName} ${lastName}`
         }
      );

      //tra ve phan hoi thanh cong
      res.status(201).json({ message: "Đăng ký thành công." });

   } catch (error) {
      console.error("Lỗi khi gọi signup:", error);
      res.status(500).json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." });
   }
}; 

export const signIn = async (req, res) => {
   try {
      //lay input
        const {username, password} = req.body;
         if(!username || !password){   
            return res.status(400).json({message: "Vui lòng điền đầy đủ thông tin."});
         }

      //kiem tra username trong db  
      const user = await User.findOne({username});
         if(!user){
            return res.status(401).json({message: "Tên đăng nhập hoặc mật khẩu không đúng."});
         }
      //kiem tra password vs hashPassword
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
         if(!passwordMatch){
            return res.status(401).json({message: "Tên đăng nhập hoặc mật khẩu không đúng."});
         }
      //neu khop, tao accessToken
         const accessToken = jwt.sign(
         { userId: user._id },
           process.env.ACCESS_TOKEN_SECRET,
         { expiresIn: ACCESS_TOKEN_TTL }           
         );

      //tao refreshToken
         const refreshToken = Crypto.randomBytes(64).toString('hex');

      //tao session moi de luu refreshToken
         await Session.create({
            userId: user._id,
            refreshToken,
            expireAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
         });

      //tra refreshToken ve cookie cho client
      res.cookie('refreshToken', refreshToken, {
         httpOnly: true, //cookie nay k the bi truy cap bang js o client
         secure: process.env.NODE_ENV === "production", // Chỉ bật secure khi ở production (HTTPS)
         sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Local dùng strict để tránh lỗi
         maxAge: REFRESH_TOKEN_TTL,
      });

      //tra accessToken ve client
      return res.status(200).json({message: `User ${user.displayName} đăng nhập thành công.`, accessToken });      
      
   } catch (error) {
      console.error("Lỗi khi gọi signIn:", error);
      res.status(500).json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." });
   }
};

export const signOut = async (req, res) => {
   try {
      //lấy refreash token từ cookie
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
         return res.status(400).json({ message: "Không tìm thấy token đăng xuất." });
      }

      //xóa refresh token khỏi db trong session
      await Session.findOneAndDelete({ refreshToken });
     
      //xóa cookie refresh token ở cookie
      res.clearCookie('refreshToken');
      return res.status(204);

   } catch (error) {
      console.error("Lỗi khi gọi signOut:", error);
      res.status(500).json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." });
   }
};

// tạo access token mới từ refresh token
export const refreshToken = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại." });
    }

    // so với refresh token trong db
    const session = await Session.findOne({ refreshToken: token });

    if (!session) {
      return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // kiểm tra hết hạn chưa
    if (session.expireAt < new Date()) {
      return res.status(403).json({ message: "Token đã hết hạn." });
    }

    // tạo access token mới
    const accessToken = jwt.sign(
      {
        userId: session.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // return
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};