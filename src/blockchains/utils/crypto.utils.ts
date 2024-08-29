import * as CryptoJS from 'crypto-js';

export const encryptWithAES = (text: string, passphrase: string) : string=> {
  return CryptoJS.AES.encrypt(text, passphrase).toString();
};

export const decryptWithAES = (ciphertext: string, passphrase: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};

//hash text with SHA3
export const encryptWithSHA256 = (text: string) : string => {
  return CryptoJS.SHA256(text).toString();
}
//hash text with SHA3
export const encryptWithSHA512 = (text: string): string => {
  return CryptoJS.SHA512(text).toString();
}

export const encryptPrivateKeyWithARES  = (text: string, passphrase: string) => {
  const encryptStr = CryptoJS.AES.encrypt(text, passphrase).toString();
  return Buffer.from(encryptStr).toString('base64');

}


export const decryptPrivateKeyWithARES  = (encryptStrBase64: string, passphrase: string) => {
  const cipherText = Buffer.from(encryptStrBase64, 'base64').toString('binary');
  const bytes = CryptoJS.AES.decrypt(cipherText, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
}


//hash text with SHA3
export const encryptWithSHA3 = (text: string): string  => {
  return CryptoJS.SHA3(text).toString();
}