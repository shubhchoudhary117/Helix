import React, { useEffect, useState } from 'react'
import "../BetsHistoryStyle.css"
import All from './All';
import Monthly from './Monthly';
import Weekly from './Weekly';
import Daily from './Daily';
import axios from "axios"

const TopBets = () => {
  let [history, setHistory] = useState("ALL_BETS");
  let [count, setCount] = useState(0)
  let [betHistories, setBetHistories] = useState(null);
  let URI = "https://bui8h16bv0.execute-api.ap-south-1.amazonaws.com/api/helix/bet"
  // let URI = "http://localhost:8080/helix/bet"

  // fetch all bet histories
  useEffect(() => {
    const getAllBetHistories = async () => {
      await axios.get(`${URI}/allbethistories`)
        .then((response) => {
          if (response.data.success) {
            setBetHistories(response.data.betHistories);
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
    getAllBetHistories();
  }, [])





  useEffect(() => {
    let tabs = document.querySelectorAll(".top-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((current) => {
          current.classList.remove("active-tab")
        });
        tab.classList.add("active-tab")
      })
    })
  }, [])


  return <>

    <div className="top-tabs">
      <button className='top-tab active-tab' onClick={() => setHistory("MONTHLY_BETS")} >monthly</button>
      <button className='top-tab' onClick={() => setHistory("WEEKLY_BETS")} >weekly</button>
      <button className='top-tab' onClick={() => setHistory("DAILY_BETS")} >daily</button>
    </div>
    <div className="details-details">
      <div className="table">
        <div className="table-header">
          <div className="th">username</div>
          <div className="th">bet amount</div>
          <div className="th">bet amount</div>
        </div>
        <div className="tbody">

          {history === "ALL_BETS" ? <All betHistories={betHistories} /> : ""};
          {history === "MONTHLY_BETS" ? <Monthly betHistories={betHistories} /> : ""}
          {history === "WEEKLY_BETS" ? <Weekly betHistories={betHistories} /> : ""}
          {history === "DAILY_BETS" ? <Daily betHistories={betHistories} /> : ""}

        </div>
      </div>

    </div>


  </>
}

export default TopBets

