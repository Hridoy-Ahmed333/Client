import {RequestType} from "../types/request.type.ts";
import {UserType} from "../types/user.type.ts";
import {LandType} from "../types/land.type.ts";

interface PropsType {
    v: RequestType,
    rejectRequest?: () => void,
    acceptRequest?: () => void,
    isAdmin?: boolean,
    confirmAddLand?: (land: LandType, rId: string | undefined) => void,
    confirmBuyLand?: (land: LandType, rId: string | undefined) => void,
    delete?: () => void
}

export function Request(props: PropsType) {
    return <div className="card text-bg-dark rounded-3 ff-poppins m-2"
                style={{minWidth: '250px', 'width': 'fit-content'}}>
        <div className="card-header">
            <div className="card-title fs-5 fw-bold">
                {props.v.type === 0
                    ? "Add Land"
                    : "Buy Land"}
            </div>
        </div>
        <div className="card-body fw-light fs-13">
            <strong>User:</strong> <span className="text-gray-400 text-xs"> {(props.v.user as UserType).name} </span>
            <br/>
            <strong>Land:</strong> <span className="text-blue-300 text-xs underline">
            <a href={'land/' + props.v.land._id} target="_blank">{props.v.land.propertyId}</a> </span><br/>
            <strong>Status:</strong>
            <span className="text-gray-400 text-xs">
            {
                props.v.type == 0 ?
                    (props.v.status === 0
                        ? 'Awaiting approval from Admin'
                        : props.v.status === 1
                            ? 'Request Accepted'
                            : props.v.status === 2
                                ? 'Request Rejected'
                                : props.v.status === 3
                                    ? 'Request Completed'
                                    : null)
                    : (props.v.status === 0
                        ? 'Awaiting approval from owner'
                        : props.v.status === 1
                            ? 'Awaiting admin approval'
                            : props.v.status === 2
                                ? 'Owner rejected'
                                : props.v.status === 3
                                    ? 'Admin confirmed'
                                    : props.v.status === 4
                                        ? 'Admin Rejected' : props.v.status === 5
                                            ? 'Request Completed' : null)

            }</span>
            <br/>
            {props.v.type === 1 ?
                <><strong>Bid Price: </strong> <span className="text-gray-400 text-xs">{props.v.biddingPrice}</span> </>
                : null}
        </div>
        <div
            className="card-footer  mb-2">
            <div className="row g-1 p-0 m-0 d-flex flex-row justify-content-center">
                {props.isAdmin
                    ? <>
                        {props.v.type === 0 && props.v.status === 0 || props.v.type === 1 && props.v.status === 1 ? <>
                            <div className="col">
                                <button className="btn btn-sm btn-outline-danger"
                                        onClick={props.rejectRequest}><i className="fa-solid fa-xmark"></i>&nbsp;Reject
                                </button>
                            </div>
                            <div className="col">
                                <button className="btn btn-sm btn-outline-success"
                                        onClick={props.acceptRequest}><i
                                    className="fa-solid fa-check"></i>&nbsp;Approve
                                </button>
                            </div>
                        </> : null}
                    </>
                    : <>
                        {props.v.type === 0 && props.v.status === 1
                            ? <>
                                <div className="col">
                                    <button className="btn btn-sm btn-outline-success"
                                            onClick={() => props.confirmAddLand?.(props.v.land, props.v?._id)}><i
                                        className="fa-solid fa-check"></i>&nbsp;Confirm Add
                                    </button>
                                </div>
                            </>
                            : null}
                        {props.v.type === 1 && props.v.status === 3 && (props.v.user as UserType).publicId === localStorage.getItem('userId') ? <>
                            <div className="col">
                                <button className="btn btn-sm btn-outline-success"
                                        onClick={() => props.confirmBuyLand?.(props.v.land, props.v?._id)}><i
                                    className="fa-solid fa-check"></i>&nbsp;Confirm Buy
                                </button>
                            </div>
                        </> : null}
                    </>}
                {props.v.type === 1 && props.v.status === 0 && props.v.approver === localStorage.getItem('userId') ? <>
                    <div className="col">
                        <button className="btn btn-sm btn-outline-success"
                                onClick={props.acceptRequest}>
                            <i className="fa-solid fa-check"></i>&nbsp;Accept
                        </button>
                    </div>
                    <div className="col">
                        <button className="btn btn-sm btn-outline-danger"
                                onClick={props.rejectRequest}><i className="fa-solid fa-xmark"></i>&nbsp;Reject
                        </button>
                    </div>
                </> : null}
                {(props.v.user as UserType).publicId === localStorage.getItem('userId')
                    ? <div className="col-3">
                        <button className="btn btn-sm btn-outline-danger" onClick={props.delete}>
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div> : null
                }
            </div>
        </div>
    </div>;
}
