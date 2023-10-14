import React, {useEffect, useState} from "react";
import "./user-data-page.sass";
import {UserType} from "../../types/user.type.ts";
import {getUsers, verifyUserBC} from "../../services/AuthService.tsx";

export const UserDataPage: React.FC<unknown> = () => {

    const url = import.meta.env.VITE_NODE_UPLOADS

    const [filteredUserData, setFilteredUserData]
        = useState<UserType[]>([]);

    const [searchTxt, setSearchTxt]
        = useState<string>("");


    const [users, setUsers] = useState<UserType[]>([])

    useEffect(() => {
        getAllUsers()
    }, []);

    function handleSearch(ev: React.FormEvent<HTMLFormElement>) {
        ev.preventDefault();
        console.log(searchTxt);
        setFilteredUserData(
            users.filter((m) =>
                m.name.toLowerCase().includes(searchTxt.toLowerCase())
                || m.nationalId.includes(searchTxt)
            )
        );
    }

    function verifyUser(id: string) {
        verifyUserBC(id).then(r => {
            console.log(r)
            getAllUsers()
        }).catch(err => {
            console.log(err)
        })
    }

    function getAllUsers() {
        getUsers().then(r => {
            console.log(r)
            setUsers(r)
            setFilteredUserData(r)
        })
    }

    return (
        <div className="master-data-page w-100" style={{overflow: "hidden"}}>
            {/*<div className="h4 text-center">Land Master Data</div>*/}
            <div className="container mt-3 overflow-auto" style={{maxWidth: "1024px"}}>
                <form
                    onSubmit={(ev) => handleSearch(ev)}
                    className="d-flex w-50 m-auto"
                >
                    <input
                        className="form-control shadow-md shadow-amber-400"
                        type="text"
                        placeholder="search users (nationalId / user name)"
                        value={searchTxt}
                        onChange={(ev) => setSearchTxt(ev.target.value)}
                    />
                    <input
                        className="transition-all ms-2 px-2 py-1.5 rounded-lg bg-yellow-500 text-black font-[Open Sans] font-[400]
                        border border-yellow-500 hover:bg-gray-800 hover:text-amber-300 hover:border hover:border-amber-200 hover:shadow-md hover:shadow-amber-400"
                        type="submit"
                        value="search"
                    />
                </form>
                <table
                    className="table table-dark mt-3"
                    style={{maxHeight: "50%", overflow: "hidden"}}
                >
                    <tbody>
                    <tr className="">
                        <th>#</th>
                        <th>National Id</th>
                        <th>User Info</th>
                        <th>Verification Id</th>
                        <th>Status</th>
                    </tr>
                    {filteredUserData.map((u, i) => (
                        <tr key={i}>
                            <td>{i + 1}</td>
                            <td className="font-[400] text-gray-400">{u.nationalId}</td>
                            <td className="font-[400] font-mono text-gray-300 text-xs">
                                {u.name} <br/> {u.emailID} <br/>
                                {u.publicId}
                            </td>
                            <td className="align-middle">
                                <a className="py-2 px-3 rounded-lg bg-amber-400 text-gray-700 flex flex-row
                                    items-center w-fit cursor-pointer" target="_blank" href={url + u.nationalIdCard}>
                                    <i className="h-5 fa-regular fa-file-image pe-3"></i>
                                    <span className="font-light text-sm font-[Poppins]"> View</span>
                                </a>
                            </td>
                            <td className="align-middle">
                                {!u.isActive ?
                                    <button className="bg-green-600 px-2.5 py-2 rounded-lg border border-green-600
                                         hover:bg-green-950 hover:shadow-md hover:shadow-green-500"
                                            onClick={() => verifyUser(u.publicId)}>
                                        verify
                                    </button>
                                    :
                                    <button className="bg-gray-500 px-2.5 py-2 rounded-lg border border-amber-600"
                                            disabled>
                                        Verified user
                                    </button>}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
