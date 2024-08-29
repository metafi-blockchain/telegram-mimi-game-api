import * as EthUtil from 'ethereumjs-util';
import Web3 from 'web3';

export  abstract class CryptoUtils {

    public static getWalletFromPrivateKey(traderPrivateKey: string): string{
        const privateKeyBuffer = EthUtil.toBuffer('0x'+ traderPrivateKey);
        let address = EthUtil.Address.fromPrivateKey(privateKeyBuffer);
        return  EthUtil.toChecksumAddress(address.toString())
    }
    public static decodeTransactionData(txData: string): any{
       return  Web3.utils.hexToAscii(txData)
    }
    
}