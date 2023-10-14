import {LandType} from "../types/land.type.ts";
import {ChangeEvent, Dispatch, SetStateAction, useState} from "react";

interface SellLandModalProps {
    onClick: () => void,
    landData: LandType,
    setLandData: Dispatch<SetStateAction<LandType>>,
    closeModal: () => any
}

export function SellLandModal(props: SellLandModalProps) {
    const [invalidImages, setInvalidImages] = useState(false);
    const handleLandImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
        console.log('images selected')
        const images = event.target.files as FileList
        if (images.length > 10) {
            setInvalidImages(true)
        } else {
            props.setLandData({
                ...props.landData,
                landImages: images
            })
        }
    }
    return <div className="modal-content">
        <div className="modal-header">
            <h1 className="modal-title fs-4" id="staticBackdropLabel">Sell a Land</h1>
            <button type="button" className="btn text-danger fs-4 p-0" onClick={props.closeModal}
                    aria-label="Close">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div className="modal-body">
            <form>
                <div className="row">
                    <div className="col-6">
                        <div className="form-floating mb-2">
                            <input type="email" className="form-control text-bg-dark" id="propertyId"
                                   value={props.landData.propertyId}
                                   onChange={(ev) => props.setLandData({
                                       ...props.landData,
                                       propertyId: ev.target.value
                                   })}
                                   placeholder="Property Id" required={true}/>
                            <label htmlFor="propertyId">Property Id</label>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-floating mb-2">
                            <input type="email" className="form-control text-bg-dark" id="village"
                                   value={props.landData.village}
                                   onChange={(ev) => props.setLandData({
                                       ...props.landData,
                                       village: ev.target.value
                                   })}
                                   placeholder="Village" required={true}/>
                            <label htmlFor="village">Village</label>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-floating mb-2">
                            <input type="email" className="form-control text-bg-dark" id="postoffice"
                                   placeholder="postoffice"
                                   value={props.landData.postOffice}
                                   onChange={(ev) => props.setLandData({
                                       ...props.landData,
                                       postOffice: ev.target.value
                                   })}
                                   required={true}/>
                            <label htmlFor="Post Office">Post Office</label>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-floating mb-2">
                            <input type="email" className="form-control text-bg-dark" id="division"
                                   placeholder="Division" value={props.landData.division}
                                   onChange={(ev) => props.setLandData({
                                       ...props.landData,
                                       division: ev.target.value
                                   })} required={true}/>
                            <label htmlFor="division">Division</label>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-floating mb-2">
                            <input type="email" className="form-control text-bg-dark" id="state"
                                   placeholder="State"
                                   value={props.landData.state}
                                   onChange={(ev) => props.setLandData({
                                       ...props.landData,
                                       state: ev.target.value
                                   })} required={true}/>
                            <label htmlFor="state">State</label>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-floating mb-2">
                            <input type="email" className="form-control text-bg-dark" id="district"
                                   value={props.landData.district}
                                   onChange={(ev) => props.setLandData({
                                       ...props.landData,
                                       district: ev.target.value
                                   })}
                                   placeholder="District" required={true}/>
                            <label htmlFor="district">District</label>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="form-floating mb-2">
                            <input type="number" className="form-control text-bg-dark" id="price"
                                   value={props.landData.price}
                                   onChange={(ev) => props.setLandData({
                                       ...props.landData,
                                       price: Number(ev.target.value)
                                   })}
                                   placeholder="Land base price" required={true}/>
                            <label htmlFor="price">Price</label>
                        </div>
                    </div>
                    <div className="col-6 mt-2 p-3">
                        <div className="form-check form-switch">
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                                List for sale
                            </label>
                            <input className="form-check-input" type="checkbox" role="switch"
                                   id="flexSwitchCheckDefault"
                                   checked={props.landData.isForSale || false}
                                   onChange={(ev) => props.setLandData({
                                       ...props.landData,
                                       isForSale: ev.target.checked
                                   })}/>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="mb-3">

                            <label htmlFor="formFileSm" className="form-label">Land Images</label>
                            <input className="form-control form-control-sm  bg-dark text-bg-dark" id="formFileSm"
                                   type="file"
                                   onChange={(event) => handleLandImageSelect(event)}
                                   multiple={true} accept="image/png, image/gif, image/jpeg"/>
                            {invalidImages ? <div className="err-text">
                                Maximum 10 land images accepted
                            </div> : null}
                        </div>
                    </div>

                    <div className="col-12 d-flex justify-content-end">
                        <input className="btn save-btn" type="submit" value="Save"
                               onClick={props.onClick}>
                        </input>
                    </div>
                </div>
            </form>
        </div>
    </div>;
}
