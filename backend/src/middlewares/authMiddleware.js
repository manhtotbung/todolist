import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const protectedRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            console.log("Khong co accesstoken");
            return res.status(401).json({ message: "Không có accesstoken, truy cập bị từ chối." });
        }

        //verify token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                console.log("Accesstoken khong hop le");
                return res.status(403).json({ message: "Accesstoken không hợp lệ." });
            }
            //tim user tuong ung voi token
            req.user = await User.findById(decoded.userId).select('-hashPassword');
            if (!req.user) {
                console.log("User khong ton tai");
                return res.status(404).json({ message: "User không tồn tại." });
            }
            //tra ve trong req
            req.user = req.user;
            next();
        });
    } catch (error) {   
        console.error("Lỗi trong middleware xác thực:", error);
        res.status(500).json({ message: "Lỗi máy chủ. Vui lòng thử lại sau." });
    }
};



      