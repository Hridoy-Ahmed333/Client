import {LandType} from "../types/land.type";
import {Carousel} from "react-bootstrap";
import Limg from '../assets/images/images.png'
import {UserType} from "../types/user.type.ts";
import {useState} from "react";

interface LandCardPropsType {
    land: LandType;
    myLand?: boolean;
    isAdmin?: boolean
    isMyLand: boolean
    buyLand: (id: string, biddingPrice: string) => void
    editLand?: (land: LandType) => void
}

export default function LandCard(props: LandCardPropsType) {
    const url = import.meta.env.VITE_NODE_UPLOADS

    const [isBidPrice, setIsBidPrice] = useState(false)
    const [biddingPrice, setBiddingPrice] = useState('')

    return (
        <div className="land-card card rounded-4 text-bg-dark">

            {(props.land.landImages as string[]).length >= 1
                ?
                <>
                    <Carousel indicators={false}>
                        {(props.land.landImages as string[])
                            .map((img, i) =>
                                <Carousel.Item key={i}>
                                    <img src={url + img} className="card-img-top d-block" alt={img}
                                         width="200px" height="180px"/>
                                </Carousel.Item>
                            )})
                    </Carousel>
                </>
                : <><img src={Limg} className="card-img-top d-block" alt="Land Image"
                         width="200px" height="180px"/></>}

            <div className="card-body">
                {/*<h4 className="text-base font-bold">*/}
                {/*    PropertyId: {props.land.propertyId || "No Property Id"}*/}
                {/*</h4>*/}
                <p className="text-sm text-gray-400">
                    PropertyId: {props.land.propertyId || "No Property Id"} <br/>
                    Owner: {(props.land.owner as UserType).name || "Owner name"}
                    <br/>
                    Price: {props.land.price || 'not defined'}
                </p>
                <div className="buttons mt-3">
                    {localStorage.getItem('userId') !== (props.land.owner as UserType).publicId
                    && props.land.isForSale
                        ? <>{!props.isAdmin
                            ? <button type="button" className="btn btn-danger mx-2"
                                      onClick={() => setIsBidPrice(true)}
                            >
                                <i className="fa-solid fa-money-check-dollar"></i> Bid Price
                            </button>
                            : null
                        }
                        </>
                        : localStorage.getItem('userId') === (props.land.owner as UserType).publicId ? <>
                            <button className="btn btn-warning" onClick={() => props.editLand?.(props.land)}>
                                <i className="fa-solid fa-pen-to-square"></i>&nbsp; Edit
                            </button>
                        </> : null}
                    <a type="button" target="_blank" href={'land/' + props.land._id}
                       className="btn btn-outline-info mx-2">
                        <i className="fa-solid fa-circle-info"></i> More Details
                    </a>
                </div>
                {isBidPrice ? <div className="flex flex-row mt-2 items-center justify-center px-2">
                    <input type="number" className="flex-1 rounded-lg px-2 py-1.5 text-sm text-gray-700"
                           placeholder="biding price"
                           value={biddingPrice}
                           onChange={(ev) => setBiddingPrice(ev.target.value)}
                    />
                    <button type="button"
                            className="btn btn-sm  btn-outline-success ms-2"
                            onClick={() => {
                                props.buyLand(props.land._id as string, biddingPrice)
                                setIsBidPrice(false)
                            }}>
                        Bid
                    </button>
                </div> : null}

            </div>
        </div>
    );
}
