import React, { useEffect, useRef, useState } from 'react'
import "./BetsHistoryStyle.css"
import axios from "axios"
import { useMemo } from 'react';

const UserBets = ({ value, firstBetAccepted, secondBetAccepted }) => {
    let [myBetHistory, setMyBetHistorie] = useState(null);
    // let URI = "http://localhost:8080/helix/bet"
      let URI = "https://bui8h16bv0.execute-api.ap-south-1.amazonaws.com/api/helix/bet"
    let [betHistories, setBetHistories] = useState(null);
    // fetch all bet histories
    // fetch all bet histories
    useEffect(() => {
        const getAllBetHistories = async () => {
            await axios.get(`${URI}/myplaced-bets/shubh@gmail.com`)
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


        <div className="details-header">
            {/* <div className="total-bets">
                All Bets<br></br>
                <span className='bets-count'></span>
            </div> */}
            {/* <div className="previous-hand">
                <button><i class="uil uil-clock"></i> previous hand</button>
            </div> */}
        </div>
        <div className="details-details">

            <div className="table">
                <div className="table-header">
                    <div className="th">username</div>
                    <div className="th">bet amount</div>
                    <div className="th">bet amount</div>
                </div>
                <div className="tbody" >
                    {
                        betHistories?.map((bet) => {
                            return <>
                                <div className="tr" id={bet?.BetOutAmount ? "placedBet-win" : "placedBet-notwin"}>
                                    <div className="td username">
                                        <img src={process.env.PUBLIC_URL + "/Photos/webPhotos/gameUser.png"}
                                            alt="loading" />{bet?.Username.slice(0, 3) + "***" + bet?.Username.slice(3, 5)}</div>
                                    <div className="td">{bet?.BetAmount}</div>
                                    <div className="td">{bet?.BetOutAmount ? bet?.BetOutAmount : "----"}</div>
                                </div>
                            </>
                        })
                    }

                </div>
            </div>

      


            {/* <table className='table'>
                <thead>
                    <tr>
                        <th>username</th>
                        <th>bet amount</th>
                        <th>bet out amount</th>
                    </tr>

                </thead>
                <tbody className='tbody'>
                    {
                        betHistories?.map(user => {
                            return user.BetHistory.map((history) => {
                                return <>
                                    <tr>
                                        <td><div className="user"><img src={process.env.PUBLIC_URL + "/Photos/webPhotos/gameUser.png"} alt="" />{user?.Username.slice(0, 3) + "***" + user?.Username.slice(3, 5)}</div> </td>
                                        <td className='bet-amount'>{history?.BetAmount}</td>
                                        <td className='bet-out'>{history?.WinAmount}</td>
                                    </tr>
                                </>
                            })
                        })
                    }
                </tbody>

            </table> */}
        </div>



    </>
}

export default UserBets




// {
//   betHistories?.map((user) => {
//       return  user?.BetHistory.map(history => {
//           return <>
//               {/* user bet history card */}
//               <div className="tr">
//                   <div className="td username"> <img src={process.env.PUBLIC_URL + "/Photos/webPhotos/gameUser.png"} alt="loading" /> {user?.Username.slice(0,3)+"***"+user?.Username.slice(3,5)}</div>
//                   <div className="td">{history?.BetAmount}</div>
//                   <div className="td">{history?.WinAmount}</div>
//               </div>
//               {/* end of the user bet history card */}
//           </>
//       })
//   })
// }





