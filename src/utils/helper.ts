import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scrypt as _scrypt,
} from 'crypto';
import { now } from 'moment';
import { CLICK_TIME_REFRESH, MAX_INCUBATE } from 'src/constants/miniapp';
import { POINT_CONFIG } from 'src/constants/telegram';
import { User } from 'src/modules/users/user.entity';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

export async function hashPassword(password: string) {
  //generate a salt
  const salt = randomBytes(16).toString('hex');
  //hash the salt and password together
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  //join the hash and the salt together
  return salt + '.' + hash.toString('hex');
}

export async function comparePassword(storePwd: string, password: string) {
  const [salt, storeHash] = storePwd.split('.');
  const hash = (await scrypt(password, salt, 64)) as Buffer;
  return storeHash === hash.toString('hex');
}

export function isEmailValid(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isHeroGenValid(gen: string): boolean {
  if (
    gen.length !=
    '100000000100001009000001700450000120000010000320000000001700000'.length
  ) {
    console.log('gen is not valid:', gen);
    return false;
  }
  return true;
}

export function getIncubationCanSpent(now: number, userUpdate: User) : number{
  let incubationCanSpent = userUpdate.incubationCanSpent;

  if (Number(userUpdate.latestIncubationClick) < Number(now) - Number(CLICK_TIME_REFRESH)) {
    incubationCanSpent = MAX_INCUBATE;
  }

  return incubationCanSpent;
}
