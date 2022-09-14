import jwt from "jsonwebtoken";
import dotenv from "dotenv";

require("dotenv").config();

export const jwtTokens = ({id,username,role,}: {id: string;username: string;role: string;}) => {
  const user = { id, username, role };
  const accessToken = jwt.sign(user, process.env.USER_ACCESS_TOKEN as string, {
    expiresIn: "120m",
  });
  return accessToken;
};
