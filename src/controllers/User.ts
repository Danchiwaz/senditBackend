import { request, Request, Response } from "express";
import pool from "../Database/config/config";
import bcrypt from "bcrypt";
import { userRegistrationSchema } from "../Helpers/userValidation/userValidation";
import parseDbData from "../Helpers/DatabaseHelpers.ts/parseDbData";

export interface ExtendedRequest extends Request {
    body: {
        fullname: string;
        username: string;
        email: string;
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
            return res.json({
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

        res.json({
            message: "You have successfully registered",
        });
    } catch (error) {
        console.log(error);

        res.json({
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
