import { NextFunction, Response, Request } from "express"
import { IUser } from "../../Interfaces/IUser"
import Users from "../../Models/UserModel"
import * as bcrypt from 'bcrypt';
import * as jwt from "jsonwebtoken";
import AuthenticationMiddleWare from "../../MiddleWare/Authentication";
import RequestWithUser from "../../Interfaces/IUserWithRequest";

export class UserController {

    SignOutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
        res.send(200);
    };


    AuthenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user: IUser | null = await Users.findOne({ Email: req.body.Email });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const password: string = user?.Password || "";
            const isPasswordMatching = await bcrypt.compare(req.body.Password, password);

            if (!isPasswordMatching) {
                res.status(500).json({ Message: 'IncorrectPassword' });
                return;
            }
            const token = this.createToken(user);
            user?.update({"LastLogin":new Date()})
            user?.save()
            res.setHeader('Set-Cookie', [this.createCookie(token)]);
            res.status(200).json({userId: user?.id, token: token, Message: "Login Success" })
        } catch (error) {
            throw error
        }
    }


    RegisterUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const body = req.body as Pick<IUser, "Email" | "Password" | "FullName" | "Gender" | "DateOfBirth" | "Scope">
            const hashedPassword = await bcrypt.hash(body.Password, 10);
            if(await Users.exists({Email:body.Email}))
                {res.status(500).json({Message:"Email Already Exist In DataBase"});
                return;
            }
                const user = new Users({
                Email: body.Email,
                Password: hashedPassword,
                FullName: body.FullName,
                Gender: body.Gender,
                DateOfBirth: new Date(body.DateOfBirth),
                LastLogin: new Date(),
                Scope: body.Scope
            })
            const token = this.createToken(user);
            const newUser: IUser = await user.save()
            res.setHeader('Set-Cookie', [this.createCookie(token)]);

            res
                .status(201)
                .json({ message: "User added", user: newUser, token })
        } catch (error) {
            throw error
        }
    }



    GetAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const ALLUsers: IUser[] = await Users.find()
            res.status(200).json({ ALLUsers })
        } catch (error) {
            throw error
        }
    }

    GetUser = async (req: RequestWithUser, res: Response): Promise<void> => {
        try {
            const currentUser: IUser | null = await req.user
                res.status(200).json(currentUser)
        } catch (error) {
            res.status(500).json({})
        }
    }

    updateUser = async (req: RequestWithUser, res: Response): Promise<void> => {
        try {
            const currentUser: IUser | null = req.user
            if(currentUser!=null){
                await Users.findByIdAndUpdate(
                { _id: currentUser._id },
                req.body
            )
            const updateduser: IUser | null = await Users.findById(currentUser._id);

            res.status(200).json({
                message: "User updated",
                updatedUser: updateduser,
            })}
            else{
                res.status(500).json({Message:"Something Went Wrong, Please Update Later"});
            }
        } catch (error) {
            throw error
        }
    }


    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const deletedUser: IUser | null = await Users.findByIdAndRemove(
                req.params.id
            )
            res.status(200).json({
                message: "User deleted",
                todo: deletedUser,
            })
        } catch (error) {
            throw error
        }
    }
    private createToken(user: IUser): TokenData {
        const expiresIn = 60 * 60; // an hour
        const secret = process.env.JWT_SECRET || "";
        var tokenData: DataStoredInToken = {UserId:user._id,Email:user.Email}
        return {
          expiresIn,
          token: jwt.sign(tokenData, secret,{expiresIn}),
        };
      }

      private createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
      }
}

export default UserController