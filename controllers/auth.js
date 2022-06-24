import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const register = async (req, res, next) => {
    try{
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const newUser = new User({
            email : req.body.email,
            name : req.body.name,
            password: hash,
        });

        await newUser.save();

        const newUser1 = JSON.parse(JSON.stringify(newUser));
        delete newUser1.password;

        const expiresIn = 60 * 60 * 60;
        const accessToken = jwt.sign({ id: newUser1._id }, process.env.JWT, {
          expiresIn: expiresIn
        });
        res.status(200).send({ "user": newUser1, "access_token": accessToken, "expires_in": expiresIn });
    }
    catch(err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try{
        const user = await User.findOne({ email: req.body.email });
        if(!user){
            return next(createError(404, "User Not Found"));
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect)
        return next(createError(400, "Wrong Credentials"));

        const expiresIn = 24 * 60 * 60;
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT, {
          expiresIn: expiresIn
        });
      
        res.status(200).send({ "message": "Successfully Signed In", "access_token": accessToken, "expires_in": expiresIn, user });
    }
    catch(err) {
        next(err);
    }
};
