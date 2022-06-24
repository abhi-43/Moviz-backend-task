import jwt from "jsonwebtoken";
import { promisify } from 'util';
import User from "../models/user.js";


  export const verifyUser = async (req, res, next) => {
    let token;
  if ('authorization' in req.headers) {
    token = req.headers['authorization'].split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  // 2) Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT);

  // 3) Check if user still exists
  const foundUser = await User.findById(decoded.id);
  
  if (!foundUser) {
    return next(
      new AppError('The user associated with this token no longer exists.', 401)
    );
  }

  let changedUser = foundUser.toObject();
  delete changedUser.password
  res.locals.user = changedUser;
  next();
};