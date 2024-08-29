import { ethers } from 'ethers';

export class EthersUtils {
  static parseTransaction(abi: string, data: string) {
    const iface = new  ethers.Interface(abi);
    return iface.parseTransaction({ data });
  }

  static decodeFunctionData(abi: string, fragment: string, data: string) {
    const iface = new ethers.Interface(abi);
    return iface.decodeFunctionData(fragment, data);
  }

  static encodeFunctionData(abi: string, fragment: string, data: any[]) {
    const iface = new ethers.Interface(abi);
    return iface.encodeFunctionData(fragment, data);
  }

  static decodeLog(abi: string, log: { topics: Array<string>; data: string }) {
    const iface = new ethers.Interface(abi);
    return iface.parseLog(log);
  }
}
