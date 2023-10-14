import LandCard from "../../components/LandCard.tsx";
import {LandType} from "../../types/land.type.ts";
import {useEffect, useState} from "react";
import {getAllLands, getLandBySearch, requestByLand} from "../../services/LandService.tsx";
import {useCustomOutletContext} from "../HomePage/HomePage.tsx";
import {ToastContextProvider} from "../../context/ToastContext.tsx";

interface PropsType {
    isAdmin: boolean
}


export const LandListPage = (props: PropsType) => {
    const [lands, setLands] = useState<LandType[]>([]);
    const {
        search, setEditModal, setSelectedLand, setToast
    } = useCustomOutletContext()
    // const [edit, setEdit] = useState(false)
    // const [selectedLand, setSelectedLand] = useState<LandType>({
    //     _id: "",
    //     district: "",
    //     division: "",
    //     isForSale: false,
    //     landImages: null,
    //     owner: "",
    //     owners: [],
    //     postOffice: "",
    //     price: 0,
    //     propertyId: "",
    //     state: "",
    //     status: false,
    //     token: "",
    //     village: ""
    // })

    useEffect(() => {
        console.log(search)
        if (search.param.length < 1)
            getAllLands().then(r => {
                console.log(r)
                setLands(r.msg as LandType[])
            }).catch(err => {
                console.log(err)
            })
        else {
            console.log(search.param, search.type)
            getLandBySearch({param: search.param, type: search.type}).then(r => {
                setLands(r.msg as LandType[])
            }).catch(err => {
                console.log(err)
            })
        }
    }, [search]);

    function handleBuyRequest(landId: string, biddingPrice: string) {
        console.log(landId)
        requestByLand(landId, biddingPrice).then(r => {
            console.log(r)
            setToast({showToast:true,toastMsg:'Land Bid successfully',toastBg:'success'})
            setTimeout(()=>{
                setToast({showToast:false,toastMsg:'Land Bid successfully',toastBg:'success'})
            },2000)
        }).catch(err => {
            setToast({showToast:true,toastMsg:'Land Bid failed',toastBg:'danger'})
            setTimeout(()=>{
                setToast({showToast:false,toastMsg:'',toastBg:''})
            },2000)
            console.log(err)
        })
    }


    function handleEditLand(l: LandType) {
        // setEdit(true)
        setSelectedLand(l)
        // console.log('land list')
        setEditModal(true)
        setSelectedLand(l)
    }

    return (
        <div
            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
            tabIndex={0}
        >
            <ToastContextProvider value={{show: true, msg: 'test toast', bg: 'success'}}>

                {lands.length >= 1
                    ?
                    <div className="row g-2 d-flex justify-content-center">
                        {
                            lands.map((l: LandType, i: number) =>
                                <div className="col  flex-grow-0" key={i}>
                                    <LandCard buyLand={(id, biddingPrice) => handleBuyRequest(id, biddingPrice)}
                                              isAdmin={props.isAdmin}
                                              editLand={(land) => handleEditLand(land)}
                                              isMyLand={false} land={l}/>
                                </div>)
                        }
                    </div>
                    : <>No lands available </>}

            </ToastContextProvider>
        </div>
    )
};

export default LandListPage
