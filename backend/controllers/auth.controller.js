import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    // Destructure the request body
    const { fullName, email, password, confirmPassword, role } = req.body;

    // Validate the request body
    if (!fullName || !email || !password || !confirmPassword || !role) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check if password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password do not match. Please try again.",
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login to continue.",
      });
    }

    // Hash the Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create the user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      avatar: `https://api.dicebear.com/5.x/initials/svg?seed=${fullName}`,
    });

    return res.status(200).json({
      success: true,
      user,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

export const login = async (req,res) => {
    try {

    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({
            success:false,
            message:"Please Fill up ALl the Required Fields"
        })
    }   

    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User is not Registered with Us Please SignUp to Continue"
        })
    }

    // Generate JWT Token and Compare Password
    if(await bcrypt.compare(password,user.password)){
        const token = jwt.sign(
            {email:user.email, id:user._id,role:user.role},
            process.env.JWT_SECRET_KEY,
            {expiresIn:"24h"}
        );
        user.token = token;
        user.password = undefined;

        // set cookie for token and return success response
        const options = {
            expires:new Date(Date.now() + 24*60*60*1000), // 24 hours
            httpOnly:true,
        }

        res.cookie("token", token , options).status(200).json({
            success:true,
            token,
            user,
            message:"User Logged In Successfully"
        })
    }else{
        return res.status(400).json({
            success:false,
            message:"Password is Incorrect"
        })
    }

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be logged in. Please try again."
        })
    }
}