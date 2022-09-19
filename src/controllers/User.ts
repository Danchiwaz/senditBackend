import { request, Request, Response } from "express";
import pool from "../Database/config/config";
import bcrypt from "bcrypt";
import {
  userLoginSchema,
  userRegistrationSchema,
} from "../Helpers/userValidation/userValidation";
import parseDbData, {
  parseSendReceivedParcels,
} from "../Helpers/DatabaseHelpers/parseDbData";
import { jwtTokens } from "../Helpers/jwtHelpers/jwt";

export interface ExtendedRequest extends Request {
  body: {
    fullname: string;
    username: string;
    email: string;
    password: string;
  };
}

export interface ExtendedRequest1 extends Request {
  body: {
    username: string;
    password: string;
  };
}

// logic to add new user or user registration
export const createUser = async (req: ExtendedRequest, res: Response) => {
  try {
    const { fullname, username, email, password } = req.body;
    const { error, value } = userRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const results = await pool.query(
      `SELECT public.getUserByUsername('${value.username}')`
    );
    const checkUserEmail = await pool.query(
      `SELECT public.GetUserByEmail('${value.email}')`
    );

    const result = parseDbData(results, "getuserbyusername");

    if (result) {
      return res.status(409).json({
        message: "username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(value.password, 10);
    await pool.query(`CALL public.userSave(
            NULL,
        '${value.fullname}',
        '${value.username}',
        '${value.email}',
        '${hashedPassword}',
        0
        )`);

    res.status(200).json({
      message: "You have successfully registered",
    });
  } catch (error) {
    console.log(error);

    res.status(409).json({
      message: "Email already exist",
    });
  }
};
// end of logic for user registration

// logic to get all users
export const getAllUsers = async (req: ExtendedRequest, res: Response) => {
  try {
    let usernames = await pool.query(
      `SELECT username FROM users WHERE isdeleted = 'no'`
    );
    usernames = usernames.rows;
    res.json(usernames);
  } catch (error) {
    res.json({
      error: error,
    });
  }
};
// logic to get all users from the db

// logic to login user
export const loginUser = async (req: ExtendedRequest1, res: Response) => {
  try {
    const { error, value } = userLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    let user = await pool.query(
      `SELECT  public.GetUserByUsername('${value.username}')`
    );
    user = parseDbData(user, "getuserbyusername");

    const validPassword = await bcrypt.compare(value.password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }
    let token = jwtTokens(user);
    let user_name = user.username;
    let user_role = user.role;
    let user_id = user.id;

    res.status(200).json({
      token: token,
      username: user_name,
      role: user_role,
      user_id,
    });
  } catch (error) {
    return res.status(409).json({
      error: "Invalid credentials",
    });
  }
};
// end of logic to login user

// logic to logout the user
export const logoutUser = (req: ExtendedRequest, res: Response) => {
  localStorage.removeItem("token");
};
// end of logic to login user

// logic to get all parcels as a receiver
export const getAllParelsAsReceiver = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    let receivedParcels = await pool.query(
      `SELECT public.GetSingleUserParcelAsReceiver('${username}')`
    );
    receivedParcels = parseSendReceivedParcels(
      receivedParcels,
      "getsingleuserparcelasreceiver"
    );
    return res.status(200).json({
      receivedParcels,
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};
// end of the logic to get all parcels as a receiver

// logic to get all parcels where user is the sender
export const getAllParcelsAsSender = async (req: Request, res: Response) => {
  try {
    const username = req.params.username;
    let sentParcels = await pool.query(
      `SELECT public.GetSingleUserParcelAsSender('${username}')`
    );
    sentParcels = parseSendReceivedParcels(
      sentParcels,
      "getsingleuserparcelassender"
    );
    return res.status(200).json({
      sentParcels,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};
// end of the logic to get all parcels where user is the sender
