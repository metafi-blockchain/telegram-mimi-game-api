
import * as CryptoJS from 'crypto-js';


export const encryptWithAES = (text: string, passphrase : string) => {

    return CryptoJS.AES.encrypt(text, passphrase).toString();
  };
  
  export const decryptWithAES = (ciphertext: string, passphrase: string) => {
    const bytes = CryptoJS.AES.decrypt(ciphertext, passphrase);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  };