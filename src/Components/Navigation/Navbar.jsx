import React, { useEffect, useRef, useState } from 'react'
import "./Navbar.css"
import Switch from '@mui/material/Switch';
import axios from 'axios';
import { useGlobalAudioPlayer } from 'react-use-audio-player';
import toast, { Toaster } from 'react-hot-toast';
import TokenService from '../../Services/TokenService';
import { useNavigate } from "react-router-dom";
// API URI PREFIX
// let uriPrefix="http://localhost:8080/helix/user"
let uriPrefix = "https://bui8h16bv0.execute-api.ap-south-1.amazonaws.com/api/helix/user"
const Navbar = ({ firstBetWin, secondBetWin, firstBetAccepted, secondBetAccepted }) => {
  const [hide, setHide] = useState(true);
  const [soundChecked, setSoundChecked] = useState(true);
  const [musicChecked, setMusicChecked] = useState(true);
  const [user, setUser] = useState(null);
  const { load } = useGlobalAudioPlayer();
  const username="Shubh@123"
  const navigate=useNavigate();
  // make notify functions for alert messages and error messages
  const notify = (message) => {
    toast.error(message);
  }


  // get user from server
  useEffect(() => {

    const getCurrentUser = async () => {
      await axios.get(`${uriPrefix}/get-user`,{headers:{authorization:TokenService.getToken()}})
        .then((response) => {
          console.log(response)
          if (response.data.result) {
            setUser(response.data.user);
          }
          if(response.data.user==null){
            notify("user not found")
          }
        })
        .catch((error) => {
          console.log(error)
          if(error.response.data.badcredintals && !error.response.data.authorization){
            navigate("/helix/login")
          }
          if(error.response.data.internalServerError){
            notify("internal server error")
          }
        })
    }
    getCurrentUser();
  }, [firstBetAccepted, secondBetAccepted, firstBetWin, secondBetWin]);

  // play the music on start the game
  useEffect(()=>{
    load(process.env.PUBLIC_URL + "/Audios/gameMusic.mp3", {
      autoplay: musicChecked,
      isReady:musicChecked
    });
  },[musicChecked,user])

  // on Logout
  const doLogout=()=>{
    TokenService.removeToken();
    navigate("/helix/login")
  }
  
  return <>
    <header>
    <Toaster toastOptions={{ className: 'Toaster' }} />
      <nav>
        <div className="logo"><img src={process.env.PUBLIC_URL + "/Photos/webPhotos/helixLogo.png"} alt="image is loading..." /></div>
        <ul >
          <li className='user-profile'><i className='icon' class="uil uil-user"></i> <div className='username'>{user?.Username}</div></li>
          <li className='user-balance'><div className="balance">balance</div> <span className='balance-value'><i class="uil uil-rupee-sign"></i>{user?.Balance.toFixed(2)}</span></li>
          {/* <li className='user-wallet'><i className='icon' class="uil uil-wallet"></i></li> */}
          <li className='menu-icon' onClick={() => setHide(!hide)}><i className='icon' class="uil uil-apps"></i></li>
        </ul>
        <div className="menus-card" id={hide ? "nonactive-menus" : "active-menus"}>
          <div className="menus-header">
            <div className="profile">SC</div>
            <div className="game-type">demo</div>
          </div>
          <div className="menus">
            {/* <div className="menu">
              <div className="menu-name"><i class="uil uil-music-note"></i>sound</div>
              <div className="menu-switch" > <Switch color='primary'  defaultChecked /></div>
            </div> */}
            <div className="menu">
              <div className="menu-name"><i class="uil uil-music"></i>music</div>
              <div className="menu-switch" > <Switch defaultChecked  onChange={() => setMusicChecked(!musicChecked)} /></div>
            </div>
            <div className="menu">
              <div className="menu-name"><i class="uil uil-flower"></i>animation</div>
            </div>
            <div className="menu">
              <div className="menu-name"><i class="uil uil-notes"></i>rules of the game</div>
            </div>
            <div className="menu">
              <div className="menu-name"><i class="uil uil-history"></i>Betting history</div>

            </div>
            <div className="menu">
              <div className="menu-name"><i class="uil uil-compact-disc"></i>game limits</div>
            </div>
            <div className="menu">
              <div className="menu-name" onClick={doLogout}><i class="uil uil-sign-out-alt"></i>Logout</div>
            </div>

          </div>
        </div>
      </nav>
    </header>

  </>
}

export default Navbar
