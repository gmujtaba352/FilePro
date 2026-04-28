import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'change_me_in_development'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
export const verifyToken = (token) => jwt.verify(token, JWT_SECRET)
