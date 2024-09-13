import { ROLE } from "src/modules/users/user.entity";

export interface IUser{

   email?: string;
   address?: string
   version?: number ;
   verify?: boolean;
   role: ROLE;
}