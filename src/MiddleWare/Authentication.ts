import { NextFunction, Response } from 'express';
import * as jwt from "jsonwebtoken";
import RequestWithUser from '../Interfaces/IUserWithRequest';
import Users from '../Models/UserModel';
 
class AuthenticationMiddleWare{

  // Sets a user for the request with the help of cookie
public static async authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
  const cookies = request.cookies;
  if (cookies && cookies.Authorization) {
    const secret = process.env.JWT_SECRET || "";
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as unknown as DataStoredInToken;
      const id = verificationResponse.UserId;
      const user = await Users.findById(id);
      if (user) {
        request.user = user;
        next();
      } else {
        response.status(500).json({Message:"Wrong Authentication Token"});
        return;
      }
    } catch (error) {
      response.status(500).json({Message:"Wrong Authentication Token",error});
      return;
    }
  } else {
    response.status(500).json({Message:"Missing Authentication Token"});
    return;
  }
}

public static async AdminAuthorization(request: RequestWithUser, response: Response, next: NextFunction) {
 
        if(request.user.Scope == 1)
        return next();
        else
        response.status(500).json({"Message":"User UnAuthorized For this Action"});
         return;
     
}


}
export default AuthenticationMiddleWare;