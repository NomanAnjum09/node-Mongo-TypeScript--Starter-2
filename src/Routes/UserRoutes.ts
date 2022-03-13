import { Router } from "express"
import UserController from "../Controller/ApiLayer/UserController"
import authMiddleware from "../MiddleWare/Authentication"


const UserRouter: Router = Router()
const userController = new UserController()
UserRouter.get("/get-all-users",authMiddleware.authMiddleware, authMiddleware.AdminAuthorization, userController.GetAllUsers)
UserRouter.get("/get-user",authMiddleware.authMiddleware ,userController.GetUser)

UserRouter.post("/add-user", userController.RegisterUser)
UserRouter.post("/signin", userController.AuthenticateUser);
UserRouter.get("/sign-out",userController.SignOutUser);
UserRouter.put("/edit-user",authMiddleware.authMiddleware, userController.updateUser)

UserRouter.delete("/delete-user/:id",authMiddleware.authMiddleware, authMiddleware.AdminAuthorization, userController.deleteUser)

export default UserRouter