
import * as jwt from 'jsonwebtoken';
import { TOKENS } from './app.enums';

interface IPayload {
    sub: string
}
export class JWTUtils{
    private secretKey: string
    constructor(secretKey: string){
        this.secretKey = secretKey;
    }
    generateVerifyToken(payload: any) : string{
        return jwt.sign(payload, this.secretKey, { expiresIn: TOKENS.OPT_VERIFY_DURATION });
    }
    verifyToken(token: string) : any{
        return jwt.verify(token, this.secretKey);
    }
}
