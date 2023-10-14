import { AbiEventFragment, AbiParameter, Contract, ContractAbi } from "web3";
import LandRegContract from "../assets/contracts/LandRegistration.json";
import LandContract from "../assets/contracts/Land.json";

import Web3 from "web3";

// declare let window: Window

class Web3Service {
  landRegABI: ContractAbi = LandRegContract.abi;
  landABI: ContractAbi = LandContract.abi;
  contract!: Contract<ContractAbi>;
  private account!: string;
  private web3!: Web3;

  private addLandEvent!: AbiParameter[];

  constructor() {
    this.getWeb3()
      .then((web3) => {
        const networkData = LandRegContract.networks[5777];
        if (networkData) {
          const address = networkData.address;
          this.contract = new web3.eth.Contract(this.landRegABI, address);
          this.addLandEvent = this.landRegABI.find(
            (a) => (a as AbiEventFragment).name === "addLandEvent"
          )?.inputs as AbiParameter[];
        }
      })
      .catch((err) => {
        console.log(err);
      });
    window.ethereum?.on("accountsChanged", () => {
      window.location.reload();
    });
  }

  getContract = (): Promise<Contract<ContractAbi>> => {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (this.contract != null) {
          resolve(this.contract);
          clearInterval(check);
        }
      }, 1000);
    });
  };

  getLandContract = (address: string): Promise<Contract<ContractAbi>> => {
    return new Promise((resolve) => {
      resolve(new this.web3.eth.Contract(this.landABI, address));
    });
  };

  getAddLandEventInputs = () => {
    return this.addLandEvent;
  };

  getCurrentAccount = (): Promise<string> => {
    return new Promise((resolve) => {
      this.getWeb3().then((web3) => {
        web3.eth.getAccounts().then((acts: string[]) => {
          this.account = acts[0];
          resolve(this.account);
        });
      });
    });
  };

  getWeb3 = async () => {
    // console.log(Web3);
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      return this.web3;
    } else {
      return this.web3;
    }
  };
}

let ws: Web3Service;
export const getWeb3Service = () => {
  if (ws) {
    return ws;
  } else {
    ws = new Web3Service();
    return ws;
  }
};

export const getConnectedAccount = async (): Promise<string> => {
  return new Promise<string>((res, rej) => {
    getWeb3Service()
      .getCurrentAccount()
      .then((r) => res(r))
      .catch((err) => rej(err));
  });
};
