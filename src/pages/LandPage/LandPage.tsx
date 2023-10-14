import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {LandType} from "../../types/land.type.ts";
import {getLandById} from "../../services/LandService.tsx";
import {Carousel} from "react-bootstrap";
import PlaceholderImg from "../../assets/images/images.png";
import './land-page.sass'
import {UserType} from "../../types/user.type.ts";

export const LandPage = () => {
    const {id} = useParams()
    const url = import.meta.env.VITE_NODE_UPLOADS
    const [land, setLand] = useState<LandType | null>(null);
    const [landDetails, setLandDetails] = useState({});
    const [owner, setOwner] = useState<UserType>();

    useEffect(() => {
        getLandById(id as string).then(r => {

            console.log((r.msg as LandType).landImages?.length)
            setLand(r.msg as LandType)
            const data = structuredClone(r.msg as LandType)
            const _owner = (r.msg as LandType).owner as UserType

            // @ts-ignore
            delete data["landImages"]
            // @ts-ignore
            delete data["__v"]
            delete data["status"]
            // @ts-ignore
            delete data["owner"]
            delete data["_id"]

            // @ts-ignore
            delete _owner["__v"]
            // @ts-ignore
            delete _owner["_id"]
            delete _owner["nationalIdCard"]

            delete data["owners"]
            setOwner(_owner)
            setLandDetails(data)
            console.log(data)
            // const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
            // const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new Tooltip(tooltipTriggerEl))
        })
    }, [id]);
    return (
        <>
            <div className="land-main container-fluid text-bg-dark rounded-0 h-100 m-0 p-0">
                <div className="container mt-2">
                    {land?.landImages?.length || 0 >= 1
                        ?
                        <>
                            <Carousel indicators={false}>
                                {(land?.landImages as string[])
                                    .map((img, i) =>
                                        <Carousel.Item key={i}>
                                            <img src={url + img} className="rounded-3" alt={img}/>
                                        </Carousel.Item>
                                    )}
                            </Carousel>
                        </>
                        : <><img src={PlaceholderImg} className="card-img-top rounded-top-3 d-block" alt="Land Image"
                        /></>}

                    <div className="land-details my-2">
                        <div className="h3 text-center">Land Details</div>
                        <table className="table shadow table-dark table-striped table-hover table-responsive">
                            <tbody>
                            {land ? Object.keys(landDetails as LandType).map((v: string, i: number) =>
                                    <tr key={i}>
                                        <td>
                                            <span className="fw-bold text-white text-capitalize">{v}</span>
                                        </td>
                                        <td>
                                            <span
                                                className="text-small text-secondary">
                                                {typeof land[`${v}`] === 'string'
                                                || typeof land[`${v}`] === 'number' ?
                                                    land[`${v}`]
                                                    : typeof land[`${v}`] === 'object' ?
                                                        land[`${v}`]?.[0]
                                                        : typeof land[`${v}`] === 'boolean' ? land[`${v}`] ? 'For Sale' : 'not for sale' :
                                                            land[`${v}`] ?
                                                                'Land Confirmed' : 'Land Not Confirmed'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                                : null}
                            {owner ? <tr>
                                <td className="text-small">
                                    Owner
                                </td>
                                <td>
                                    {/*<button*/}
                                    {/*    className="btn p-0 text-small fw-bold text-warning" data-bs-toggle="tooltip"*/}
                                    {/*    data-bs-html="true"*/}
                                    {/*    data-bs-title={`${owner?.name} <br> ${owner?.emailID} <br> ${owner?.phone}`}>*/}
                                    {/*    {owner?.name}*/}
                                    {/*</button>*/}
                                    <span className="small-text text-secondary">
                                        {JSON.stringify(owner)
                                            .replaceAll("\"", "")
                                            .replace("{", "")
                                            .replace("}", "")
                                            .replaceAll(":", ": ")
                                            .split(",").map(o =>
                                                <>{o} <br/>   </>
                                            )}
                                    </span>
                                </td>
                            </tr> : null}

                            <tr>
                                <td>
                                    Owners
                                </td>
                                <td>
                                    {land?.owners?.map((o, i) =>
                                        <span className="text-small text-secondary" key={i}>
                                            {o} <br/>
                                        </span>
                                    )}
                                </td>

                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

        </>
    );
};
