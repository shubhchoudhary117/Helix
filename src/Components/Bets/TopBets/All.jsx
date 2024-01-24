import React, { useEffect, useState } from 'react'

const All = ({ betHistories }) => {
  const [allBetHistories, setAllBetHistories] = useState();
  return <>

    {
      betHistories?.map((user) => {
      return  user?.BetHistory.map((history) => {
          return <>
            <div className="tr" id='placedBet-win'>
              <div className="td username">
                <img src={process.env.PUBLIC_URL + "/Photos/webPhotos/gameUser.png"} alt="loading" />
                shu***bh</div>
              <div className="td">100.0</div>
              <div className="td">2000</div>
            </div>

          </>
        })
      })
    }






  </>
}

export default All
