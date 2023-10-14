import { ResponseType } from "../types/response.type.ts";
import { getWeb3Service } from "./Web3Service.tsx";
import axios from "axios";
import { API } from "./API.tsx";
import { AbiParameter } from "web3";
import { LandType } from "../types/land.type.ts";
import { getLandOwners } from "./RequestService.tsx";

interface addLandEventType {
  owner: string;
  token: string;
}

const ws = getWeb3Service();
// export const addLand = (data: FormData): Promise<ResponseType> => {
//     return new Promise<ResponseType>((res, rej) => {
//         ws.getContract()
//           .then(c => {
//               ws.getCurrentAccount()
//                 .then(a => {
//                     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                     // @ts-ignore
//                     c.methods.addLand(data.get('propertyId'))
//                      .send({from: a})
//                      .on('receipt', (r) => {
//                          console.log(r)
//                          decodeAddLandLog(r.logs[0].data as string, r.logs[0].topics as string[])
//                              .then(rr => {
//                                  console.log(rr.owner, rr.token)
//
//                                  data.set('owner', rr.owner.toString())
//                                  data.set('token', rr.token.toString())
//                                  axios.post(API + 'land/', data)
//                                       .then(l => {
//                                           console.log(l)
//                                           res({status: true, msg: 'Land Added successfully'})
//                                       })
//                                       .catch(er => {
//                                           console.log(er)
//                                           rej(er)
//                                       })
//                              })
//
//                      })
//                      .on('error', err => {
//                          console.log(err)
//                      })
//
//                 })
//
//           })
//     });
// }

export const requestAddLand = (data: FormData) => {
  data.set("owner", localStorage.getItem("userId") || "");
  return new Promise<ResponseType>((res, rej) => {
    axios
      .post(API + "land/", data)
      .then((l) => {
        console.log(l.data);
        if (l.data.status === "failed")
          res({ status: false, msg: l.data.data });
        res({ status: true, msg: "New Land Requested successfully" });
      })
      .catch((er) => {
        console.log(er);
        rej(er);
      });
  });
};

export const updateLand = (data: FormData) => {
  data.set("owner", localStorage.getItem("userId") || "");
  return new Promise<ResponseType>((res, rej) => {
    axios
      .post(API + "land/update", data)
      .then((l) => {
        console.log(l.data);
        if (l.data.status === "failed") res({ status: false, msg: l.data.msg });
        res({ status: true, msg: l.data.msg });
      })
      .catch((er) => {
        console.log(er);
        rej(er);
      });
  });
};

export const requestByLand = (land: string, price: string) => {
  const data = {
    land: land,
    user: localStorage.getItem("userId") || "",
    biddingPrice: price,
  };
  return new Promise<ResponseType>((res, rej) => {
    axios
      .post(API + "land/buy/request", data)
      .then((l) => {
        console.log(l);
        res({ status: true, msg: "Requested to buy land" });
      })
      .catch((er) => {
        console.log(er);
        rej(er);
      });
  });
};

export const confirmAddLand = (
  land: LandType,
  rId: string
): Promise<ResponseType> => {
  return new Promise<ResponseType>((res, rej) => {
    ws.getContract().then((c) => {
      ws.getCurrentAccount().then((a) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        c.methods // @ts-ignore
          .addLand(land.propertyId)
          .send({ from: a })
          .on("receipt", (r) => {
            console.log(r.events.addLandEvent.returnValues.token);
            land.token = r.events.addLandEvent.returnValues.token.toString();
            console.log(land);

            axios
              .put(API + "land/confirm/" + rId, land)
              .then((l) => {
                console.log(l);
                res({
                  status: true,
                  msg: "Adding land confirmed successfully",
                });
              })
              .catch((er) => {
                console.log(er);
                rej(er);
              });
          })
          .on("error", (err) => {
            console.log(err);
          });
      });
    });
  });
};

export const confirmBuyLand = (
  land: LandType,
  rId: string
): Promise<ResponseType> => {
  return new Promise((resolve, reject) => {
    ws.getLandContract(land.token).then((c) => {
      console.log(c);
      ws.getCurrentAccount().then((a: string) => {
        c.methods // @ts-ignore
          .updateOwner(a)
          .send({ from: a })
          .on("confirmation", (r) => {
            console.log(r);
            axios
              .post(API + "land/buy", {
                land: land._id,
                request: rId,
                owner: a,
              })
              .then((r) => {
                console.log(r);
                resolve({ status: true, msg: "Land buying successful" });
              })
              .catch((err) => reject(err));
          })
          .on("error", (err) => {
            reject(err);
          });
      });
    });
  });
};

export const getAllLands = (): Promise<ResponseType> => {
  return new Promise<ResponseType>((res, rej) => {
    axios
      .get(API + "land/")
      .then((r) => {
        console.log(r);
        res({ status: true, msg: r.data.filter((v: LandType) => v.status) });
      })
      .catch((err) => {
        console.log(err);
        rej(err);
      });
  });
};

export const getMasterData = (): Promise<ResponseType> => {
  return new Promise<ResponseType>((res, rej) => {
    axios
      .get(API + "master-data/")
      .then((r) => {
        // console.log(r)
        res({ status: true, msg: r.data });
      })
      .catch((err) => {
        console.log(err);
        rej(err);
      });
  });
};
// export const getMyLands = (): Promise<LandType[]> => {
//     return new Promise((res, rej) => {
//         ws.getCurrentAccount()
//             .then(a => {
//                 getAllLands()
//                     .then(r => {
//                         const lands = r.msg as LandType[]
//                         console.log(lands)
//                         res(lands.filter((v) => (v.owner as UserType).publicId === a))
//                     })
//                     .catch(err => {
//                         console.log(err)
//                         rej(err)
//                     })
//             })
//     })
// }

// export const getLandsToBuy = (): Promise<LandType[]> => {
//     return new Promise((res, rej) => {
//         ws.getCurrentAccount()
//             .then(a => {
//                 getAllLands()
//                     .then(r => {
//                         const lands = r.msg as LandType[]
//                         console.log(lands)
//                         console.log(lands.filter((v) => (v.owner as UserType).publicId !== a))
//                         res(lands.filter((v) => (v.owner as UserType).publicId !== a))
//                     })
//                     .catch(err => {
//                         console.log(err)
//                         rej(err)
//                     })
//             })
//     })
// }

export const getLandById = (id: string): Promise<ResponseType> => {
  return new Promise<ResponseType>((res, rej) => {
    axios
      .get(API + "land/" + id)
      .then((r) => {
        console.log(r);
        const land: LandType = r.data;
        // land.owner = (land.owner as UserType).name
        console.log(land);
        if (land.token)
          getLandOwners(land.token).then((r) => {
            // let owners:string = "[";
            // (r.msg as string[]).forEach((o: string) => {
            //     owners += o + ","
            // })
            // owners += "]"
            land.owners = r.msg as string[];
            res({ status: true, msg: land });
          });
        else res({ status: true, msg: land });
      })
      .catch((err) => {
        rej(err);
      });
  });
};

export const getLandBySearch = (d: SearchQueryType) => {
  const data: {
    token: string;
    village: string;
    propertyId: string;
    postOffice: string;
    division: string;
    district: string;
  } = {
    district: "",
    division: "",
    postOffice: "",
    propertyId: "",
    village: "",
    token: "",
  };
  switch (d.type) {
    case "1":
      data.token = d.param;
      break;
    case "2":
      data.propertyId = d.param;
      break;
    case "3":
      data.village = d.param;
      break;
    case "4":
      data.postOffice = d.param;
      break;
    case "5":
      data.division = d.param;
      break;
    case "6":
      data.district = d.param;
      break;
  }
  return new Promise<ResponseType>((res, rej) => {
    console.log(data);
    axios
      .post(API + "land/search", data)
      .then((r) => {
        console.log(r);
        res({ msg: r.data, status: true });
      })
      .catch((err) => {
        rej(err);
      });
  });
};

const decodeAddLandLog = (
  data: string,
  topics: string[]
): Promise<addLandEventType> => {
  return new Promise<addLandEventType>((res, rej) => {
    const inputs: AbiParameter[] = ws.getAddLandEventInputs();
    console.log(inputs);
    ws.getWeb3()
      .then(async (web3) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        res(web3.eth.abi.decodeLog(inputs, data, topics));
      })
      .catch((err) => {
        rej(err);
        console.log(err);
      });
  });
};
