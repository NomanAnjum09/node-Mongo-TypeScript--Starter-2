import { Request } from 'express';
import {IUser} from "../Interfaces/IUser";
 
interface RequestWithUser extends Request {
  user: IUser;
}
 
export default RequestWithUser;