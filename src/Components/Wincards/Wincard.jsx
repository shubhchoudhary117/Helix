import React, { useEffect } from 'react'
import "./Wincard.css"
const Wincard = ({amount,position}) => {

    return <>

        {/* win message card designe */}
        <div className="bet-win-card"  id={position==="left"?"first-bet-win":"second-bet-win"}>
            <div className="card-wrapper">
                <p className='win-status'>win</p>
                <p className='win-amount'>{amount} DMO</p>
                <p className='star1'><i class="uil uil-star"></i></p>
                <p className='star2'><i class="uil uil-star"></i></p>
                <p className='star3'><i class="uil uil-star"></i></p>
            </div>
        </div>
        {/* end of the card */}

    </>
}

export default Wincard
