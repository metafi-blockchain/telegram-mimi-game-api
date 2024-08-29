
import { createCipheriv, createDecipheriv, randomBytes, scrypt as _scrypt } from 'crypto';
import {promisify} from 'util'
const scrypt = promisify(_scrypt);

export  async function hashPassword (password: string){

    //generate a salt
    const salt = randomBytes(16).toString('hex');
    //hash the salt and password together
    const hash = await scrypt(password, salt, 64) as Buffer
    //join the hash and the salt together
    return salt + '.' + hash.toString('hex')
  }
 
  

  export  async function  comparePassword(storePwd: string, password: string){

    const [salt, storeHash] = storePwd.split('.');
    const hash = (await scrypt(password, salt, 64)) as Buffer;
    return storeHash === hash.toString('hex');

  }

  export function isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }