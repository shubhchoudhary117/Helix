import React, { useEffect, useRef, useState } from 'react'
import axios from "axios"
import "./BetsHistoryStyle.css"
import { useMemo } from 'react';

const AllBets = ({ value, firstBetAccepted, secondBetAccepted }) => {

    let [count, setCount] = useState(0)
    let [betHistories, setBetHistories] = useState(null);
    // let URI = "http://localhost:8080/helix/bet"
    let URI = "https://bui8h16bv0.execute-api.ap-south-1.amazonaws.com/api/helix/bet"
    let totalBets = useRef(0);
    // fetch all bet histories
    useEffect(() => {
        const getAllBetHistories = async () => {
            await axios.get(`${URI}/currentbet-winers`)
                .then((response) => {
                    console.log(response)
                    if (response.data.success) {
                        setBetHistories(response.data.wins);
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
        getAllBetHistories();
    }, [value, firstBetAccepted, secondBetAccepted])


    return <>


        <div className="details-details">

            <div className="table">
                <div className="table-header">
                    <div className="th">usernsssame</div>
                    <div className="th">bet amount</div>
                    <div className="th">bet out amount</div>
                </div>
                <div className="tbody">
                    {
                        betHistories?.map((bet) => {
                            return <>
                                <div className="tr" id={bet?.BetOutAmount ? "placedBet-win" : "placedBet-notwin"}>
                                    <div className="td username">
                                        <img src={process.env.PUBLIC_URL + "/Photos/webPhotos/gameUser.png"}
                                            alt="loading" />{bet?.Username.slice(0, 3) + "***" + bet?.Username.slice(3, 5)}</div>
                                    <div className="td">{bet?.BetAmount}</div>
                                    <div className="td">{bet?.BetOutAmount != null || 0 ? bet?.BetOutAmount : "----"}</div>
                                </div>
                            </>
                        })
                    }
                </div>
            </div>

            {/* 
            <table >
                <thead>
                    <tr>
                        <th>username</th>
                        <th>bet amount</th>
                        <th>bet out amount</th>
                    </tr>

                </thead>
                <tbody>
                    {
                        betHistories?.map((bet) => {
                            return <>
                                <tr id={bet?.BetOutAmount?"placedBet-win":"placedBet-notwin"}>
                                    <td><div className="user"><img src={process.env.PUBLIC_URL + "/Photos/webPhotos/gameUser.png"} alt="" />{bet?.Username.slice(0, 3) + "***" + bet?.Username.slice(3, 5)}</div> </td>
                                    <td className='bet-amount'>{bet?.BetAmount}</td>
                                    <td className='bet-out'>{bet?.BetOutAmount ? bet?.BetOutAmount : "----"}</td>
                                </tr>
                            </>
                        })
                    }
                </tbody>

            </table> */}
        </div>

    </>
}

export default AllBets
