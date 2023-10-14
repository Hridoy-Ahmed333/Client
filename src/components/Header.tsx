import {Dispatch, FormEvent, SetStateAction, useState} from "react";
import {UserType} from "../types/user.type.ts";

interface HeaderProps {
    onSellLand: () => void
    onLogOut: () => void
    isAdmin: boolean
    changePwd?: () => void
    searchQuery?: SearchQueryType
    setSearchQuery: Dispatch<SetStateAction<SearchQueryType>>
    user: UserType
}

export function Header(props: HeaderProps) {

    const [searchTxt, setSearchTxt] = useState('');
    const [searchType, setSearchType] = useState('1');

    function handleSearch(ev: FormEvent<HTMLFormElement>) {
        ev.preventDefault()
        console.log(searchType, searchTxt)
        props.setSearchQuery({type: searchType, param: searchTxt})
    }

    return (<div className="header d-flex justify-content-lg-between">
            <div
                className="sm:text-lg truncate md:text-2xl text-zinc-300 px-2 py-3 d-flex justify-content-between align-items-center">
               Land Registration
            </div>
            <div className="search-container my-2">
                <form onSubmit={(event) => handleSearch(event)}>
                    <select aria-label="select" className="form-select" name="search"
                            onChange={(ev) => setSearchType(ev.target.value)}
                    >
                        <option defaultValue="1" value="1">Land Token</option>
                        <option value="2">Property Id</option>
                        <option value="3">Village</option>
                        <option value="4">Post Office</option>
                        <option value="5">Division</option>
                        <option value="6">District</option>
                    </select>
                    <div className="input-group">
                        <input className="form-control py-2" type="search" placeholder="Search" value={searchTxt}
                               onChange={(event) => setSearchTxt(event.target.value)}/>
                    </div>
                    <button type="submit" className='btn'><i className="fas fa-search"></i></button>
                </form>

            </div>
            <div className="buttons mt-3">
                <div className="px-3 text-success fw-medium small-text">
                    {props.user.publicId} <br/>
                    <span className="text-warning">{props.user.balance}</span>
                </div>
                {!props.isAdmin
                    ?
                    <button className="btn btn-outline-light mx-3 truncate" onClick={props.onSellLand}>
                        <i className="fa-solid fa-land-mine-on"></i>
                        &nbsp;&nbsp;Add a Land
                    </button>
                    : null}
                <div className="dropdown">
                    <button
                        className="btn btn-outline-warning d-flex align-items-center text-decoration-none dropdown-toggle p-3 me-3"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        {/*{localStorage.getItem('username')}*/}
                        {props.user.name}
                        <i className="fa-solid fa-user-gear fs-6 ms-2"></i>
                    </button>
                    <ul className="dropdown-menu text-small text-white shadow mx-3">
                        <li>
                            <button className="dropdown-item" onClick={props.changePwd}>
                                <i className="fa-solid fa-unlock-keyhole"></i>&nbsp; Change Password
                            </button>
                        </li>
                        <li>
                            <hr className="dropdown-divider"/>
                        </li>
                        <li>
                            <button className="dropdown-item" onClick={props.onLogOut}><i
                                className="fa-solid fa-right-from-bracket"></i>&nbsp; Sign out
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
