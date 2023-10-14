import {Component} from 'react';
import {RequestType} from "../../types/request.type.ts";
import {Request} from "../../components/Request.tsx";
import {
    deleteRequest,
    getAllMyRequests,
    getAllRequestsAdmin,
    getPendingRequests,
    updateRequest
} from "../../services/RequestService.tsx";
import {LandType} from "../../types/land.type.ts";
import {confirmAddLand, confirmBuyLand} from "../../services/LandService.tsx";
import {Accordion} from "react-bootstrap";
import './request-page.sass'

interface StateProps {
    requests: RequestType[]
    pendingRequests: RequestType[]
}

interface PropsType {
    isAdmin?: boolean
}

class RequestPage extends Component<PropsType, StateProps> {
    constructor(props: PropsType) {
        super(props);
        this.state = {
            requests: [], pendingRequests: []
        }
    }

    getAllRequests() {
        if (this.props.isAdmin) {
            getAllRequestsAdmin()
                .then(r => {
                    console.log(r)
                    this.setState({pendingRequests: r.msg as RequestType[]})
                }).catch(err => {
                console.log(err)
            })
        } else {
            getAllMyRequests()
                .then(r => {
                    console.log(r)
                    this.setState({requests: r.msg as RequestType[]})
                })
                .catch(err => {
                    console.log(err)
                })
            getPendingRequests()
                .then(r => {
                    console.log(r)
                    this.setState({pendingRequests: r.msg as RequestType[]})
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    componentDidMount() {
        this.getAllRequests()
    }

    handleUpdateRequest = (id: string | undefined, status: number) => {
        updateRequest(id, status)
            .then(r => {
                console.log(r)
                this.getAllRequests()
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleConfirmAddLand(l: LandType, rId: string | undefined) {
        confirmAddLand(l, rId as string)
            .then(r => {
                console.log(r)
                if (r.status) this.getAllRequests()
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleConfirmBuyLand(l: LandType, rId: string | undefined) {
        confirmBuyLand(l, rId as string)
            .then(r => {
                console.log(r)
                if (r.status) this.getAllRequests()
            })
            .catch(err => {
                console.log(err)
            })
    }

    handleDeleteRequest(rId: string) {
        deleteRequest(rId).then(r => {
            console.log(r)
            this.getAllRequests()
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div className="w-full">
                <Accordion defaultActiveKey="0" flush className="p-5">
                    <Accordion.Item eventKey="0" className="mb-3">
                        <Accordion.Header>Pending Requests</Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex w-100 justify-content-center align-items-start flex-row">
                                <> {this.state.pendingRequests.length >= 1
                                    ? <>
                                        {this.state.pendingRequests.map((v, i) =>
                                            <Request v={v} key={i}
                                                     isAdmin={this.props.isAdmin}
                                                     confirmAddLand={() => this.handleConfirmAddLand(v.land, v._id)}
                                                     rejectRequest={() => this.handleUpdateRequest(v._id, v.type === 1 && v.status === 1 ? 4 : 2)}
                                                     acceptRequest={() => this.handleUpdateRequest(v._id, v.type === 1 && v.status === 1 ? 3 : 1)}

                                            />
                                        )}
                                    </>
                                    : <>No Pending Requests</>}</>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    {!this.props.isAdmin ?
                        <Accordion.Item eventKey="1">
                            <Accordion.Header>My Requests</Accordion.Header>
                            <Accordion.Body>
                                <div className="d-flex w-100 justify-content-center align-items-start flex-row">
                                    <> {this.state.requests.length >= 1
                                        ? <>
                                            {this.state.requests.map((v, i) =>

                                                <Request v={v} key={i}
                                                         isAdmin={this.props.isAdmin}
                                                         confirmAddLand={() => this.handleConfirmAddLand(v.land, v._id)}
                                                         confirmBuyLand={() => this.handleConfirmBuyLand(v.land, v._id)}
                                                         rejectRequest={() => this.handleUpdateRequest(v._id, 2)}
                                                         delete={() => this.handleDeleteRequest(v._id as string)}
                                                         acceptRequest={() => this.handleUpdateRequest(v._id, 1)}/>
                                            )}
                                        </>
                                        : <>No Requests</>}</>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                        : null}

                </Accordion>
            </div>
        );
    }
}

export default RequestPage;
