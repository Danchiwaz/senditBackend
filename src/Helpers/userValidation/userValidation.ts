import joi from "joi";
import { IUserRegister } from "../../Interfaces/userRegistration";

export const userRegistrationSchema = joi.object({
  fullname: joi.string().required(),
  username: joi.string().required(),
  email: joi.string().required().email(),
  password: joi.string().required(),
});

export const userLoginSchema = joi.object({
     username: joi.string().required(),
     password: joi.string().required(),
})