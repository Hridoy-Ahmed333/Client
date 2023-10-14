import { getWeb3Service } from "./Web3Service.tsx";
import { LoginType } from "../types/login.type.ts";
import { ResponseType } from "../types/response.type.ts";
import { Contract, ContractAbi } from "web3";
import { UserType } from "../types/user.type.ts";
import axios from "axios";
import { API } from "./API.tsx";

const ws = getWeb3Service();

export const userLogin = (data: LoginType): Promise<ResponseType> => {
  const d: ResponseType = {
    status: false,
    msg: "",
  };
  return new Promise<ResponseType>((resolve, reject) => {
    ws.getContract().then((c: Contract<ContractAbi>) => {
      console.log(c);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      c.methods
        .login(data.password)
        .call({ from: data.username })
        .then((r) => {
          console.log(Number(r));
          switch (Number(r)) {
            case 100:
              d.status = true;
              d.msg = "admin";
              localStorage.setItem("isLoggedIn", "true");
              localStorage.setItem("isAdmin", "true");
              localStorage.setItem("userId", data.username);
              break;
            case 1:
              d.status = true;
              d.msg = "user";
              localStorage.setItem("isLoggedIn", "true");
              localStorage.setItem("isAdmin", "false");
              localStorage.setItem("userId", data.username);
              break;
            case 99:
              d.status = false;
              d.msg = "Admin password incorrect";
              break;
            case 9:
              d.status = false;
              d.msg = "password incorrect";
              break;
            case 11:
              d.status = false;
              d.msg = "Account is not verified";
              break;
            case 0:
              d.status = false;
              d.msg = "User not registered";
              break;
          }
          resolve(d);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  });
};

export const registerUser = (d: FormData): Promise<ResponseType> => {
  console.log(API);
  return new Promise<ResponseType>((resolve, reject) => {
    ws.getContract().then((c) => {
      ws.getCurrentAccount().then((a) => {
        console.log(d.get("password"), d.get("nationalId"), a);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        c.methods
          .addUser(d.get("password"), d.get("nationalId"))
          .send({ from: a })
          .on("confirmation", (r) => {
            console.log(r);
            axios
              .post(API + "user/", d)
              .then((u) => {
                console.log(u);
                resolve({ status: true, msg: "user added successfully" });
              })
              .catch((err) => {
                reject(err);
              });
          })
          .on("error", (err) => {
            console.log(err);
          });
      });
    });
  });
};

export const checkIsValidUser = () => {
  return new Promise((resolve, reject) => {
    ws.getContract().then((c) => {
      ws.getCurrentAccount().then((a) => {
        c.methods
          .isValidUser()
          .call({ from: a })
          .then((r) => {
            resolve(r);
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    });
  });
};

export const getUserData = (userId: string): Promise<ResponseType> => {
  let user: UserType = {
    emailID: "",
    name: "admin",
    nationalId: "",
    phone: "",
    publicId: userId,
  };
  return new Promise((resolve, reject) => {
    axios
      .get(API + "user/" + userId)
      .then((r) => {
        console.log(r);
        user = r.data?.[0] || user;
        ws.getWeb3().then((w) => {
          w.eth.getBalance(userId).then((r) => {
            user.balance =
              parseFloat(w.utils.fromWei(r, "ether")).toFixed(2) + " ETH";
            resolve({ status: true, msg: user });
          });
        });
      })
      .catch((err) => reject(err));
  });
};

export const changeUserPassword = (pwd: string): Promise<ResponseType> => {
  return new Promise((resolve, reject) => {
    ws.getCurrentAccount().then((a) => {
      ws.getContract().then((c) => {
        // @ts-ignore
        c.methods
          .changePassword(pwd)
          .send({ from: a })
          .on("confirmation", (r) => {
            resolve({ status: true, msg: "Password Changed Successfully" });
          })
          .on("error", (err) => {
            reject(err);
          });
      });
    });
  });
};

export const getUsers = (): Promise<UserType[]> => {
  let users: UserType[] = [];
  return new Promise<UserType[]>((resolve, reject) => {
    axios
      .get(API + "user")
      .then(async (r) => {
        // console.log(r)
        let _usersBc: void | UserType[] = [];
        await ws
          .getContract()
          .then((c) => {
            c.methods
              .getAllUsers()
              .call()
              .then((u) => {
                console.log(u);
                _usersBc = u;
                console.log(r.data.data, _usersBc);
                r.data.data.forEach((_u: UserType) => {
                  console.log(_usersBc as UserType[]);
                  console.log(
                    (_usersBc as UserType[]).filter(
                      (us) => us.id?.toString() == _u.publicId
                    )
                  );
                  _u.isActive = (_usersBc as UserType[]).filter(
                    (us) => us.id?.toString() == _u.publicId
                  )[0]?.isActive;
                  users.push(_u);
                });
                console.log(users);
                resolve(users);
              })
              .catch((err) => reject(err));
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

export const verifyUserBC = (publicId: string): Promise<Boolean> => {
  return new Promise<Boolean>((resolve, reject) => {
    ws.getContract().then((c) => {
      ws.getCurrentAccount().then((a) => {
        // @ts-ignore
        c.methods
          .verifyUser(publicId)
          .send({ from: a })
          .on("confirmation", (r) => {
            console.log(r);
            resolve(true);
          })
          .on("error", (err) => {
            console.log(err);
            reject(err);
          });
      });
    });
  });
};

export const sendVerificationOTP = (nationalId: string) => {
  return axios.post(API + "otp/send", { nationalId: nationalId });
};
