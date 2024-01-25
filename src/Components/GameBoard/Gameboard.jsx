import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import "./Gameboard.css"
import { Unity, useUnityContext } from "react-unity-webgl";
import { Suspense } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Wincard from '../Wincards/Wincard';
import axios from 'axios';
import Navbar from '../Navigation/Navbar';

import CustomSwitch from '../Coustom/Switch/CustomSwitch';
import ClipLoader from "react-spinners/ClipLoader"
import TokenService from '../../Services/TokenService';
// lazy loading
var UserBets = React.lazy(() => import("../Bets/UserBets"))
var AllBets = React.lazy(() => import('../Bets/AllBets'))
var TopBets = React.lazy(() => import("../Bets/TopBets/TopBets"))

// configuration for making http request to server
const config = {
  headers: {
    'Content-Type': 'application/json'
  }
}
// Server API URI PREFIX
// let uriPrefix = "http://localhost:8080/helix"
let uriPrefix = "https://bui8h16bv0.execute-api.ap-south-1.amazonaws.com/api/helix"
const Gameboard = () => {
  // create states for store data and update data 

  // create user state for storing the curret user
  const [user, setUser] = useState(null);
  // this state is used to forcefully rerender the component
  var [reducerValue, forceUpdate] = useReducer(x => x + 1, 0)
  // this state is used for navigate on bet history tabs
  const [history, setHistory] = useState("ALL_BETS");

  // create stats for the navigation bar and sound 
  const [hide, setHide] = useState(true);
  const [soundChecked, setSoundChecked] = useState(true);
  const [musicChecked, setMusicChecked] = useState(true);
  // define autocollect bet numbers array
  const firstBetAutoCollectNumbers = ["1.10", "1.20", "1.30", "1.40", "1.50", "1.60", "1.70",
    "1.80", "1.90", "200", "300", "400", "500", "600", "700", "800", "900", "1000"];

  const secondBetAutoCollectNumbers = ["1.10", "1.20", "1.30", "1.40", "1.50", "1.60", "1.70",
    "1.80", "1.90", "200", "300", "400", "500", "600", "700", "800", "900", "1000"];
  // this states is releted to place bet and other bet related functionality
  var [firstbettingAmount, setFirstBettingAmount] = useState(10);
  var [secondBettingAmount, setSecondBettingAmount] = useState(10);
  const [currentBet, setCurrentBet] = useState(null);
  const [showPlaceFirstBet, setShowPlaceFirstBet] = useState(true);
  const [showPlaceSecondBet, setShowPlaceSecondBet] = useState(true);
  const [firstBetAccepted, setFirstBetAccepted] = useState(false);
  const [secondBetAccepted, setSecondBetAccepted] = useState(false);
  var [firstBetAutoCollectBetNumber, setFirstBetAutoCollectBetNumber] = useState(firstBetAutoCollectNumbers[0]);
  const [secondBetAutoCollectBetNumber, setSecondBetAutoCollectBetNumber] = useState(firstBetAutoCollectNumbers[0]);
  const [firstBetIsAuto, setFirstBetIsAuto] = useState(false);
  const [secondBetIsAuto, setSecondBetIsAuto] = useState(false);
  const [firstBetIsAutoCollect, setFirstBetIsAutoCollect] = useState(false);
  const [secondBetIsAutoCollect, setSecondBetIsAutoCollect] = useState(false);
  const [userBetStatus, setUserBetStatus] = useState({});
  const [gameStatus, setGameStatus] = useState(null);
  const [userCurrentBets, setUserCurrentBets] = useState(null);
  const [showFirstBetCollectAmount, setShowFirstBetCollectAmount] = useState(false);
  const [showSecondBetCollectAmount, setShowSecondBetCollectAmount] = useState(false);
  const [firstBetWinAmount, setFirstBetWinAmount] = useState(0);
  const [secondBetWinAmount, setSecondBetWinAmount] = useState(0);
  const [firstBetWin, setFirstBetWin] = useState(false);
  const [secondBetWin, setSecondBetWin] = useState(false);
  var [liveBetNumber, setLiveBetNumber] = useState(0);
  var [firstBetCollectingAmount, setFirstBetCollectingAmount] = useState(0);
  var [secondBetCollectingAmount, setSecondBetCollectingAmount] = useState(0);
  var [aeroplanIsCrashed, setAeroPlanCrash] = useState(false);
  var [gameisStart, setGameIsStart] = useState(0);
  var [gameIsLoading, setGameIsLoading] = useState(0);
  var [placeFirstBetForNextRound, setPlaceFirstBetForNextRound] = useState(false);
  var [placeSecondBetForNextRound, setPlaceSecondBetForNextRound] = useState(false);
  var [showFirstBetCancleButton, setShowFirstBetCancleButton] = useState(false);
  var [showSecondBetCancleButton, setShowSecondBetCancleButton] = useState(false);
  var [betHistories, setBetHistories] = useState([]);
  var [planCrashHistories, setPlanCrashHistories] = useState(null);

  // Game Rounds States
  const [roundId, setNewRoundId] = useState(null);
  // this audio ref is point my audio tag
  const firstBetAudioRef = useRef();
  const secondBetAudioRef = useRef();
  const navigate = useNavigate();

  // get current Authenticate user from server
  useEffect(() => {
    const getCurrentUser = async () => {
      await axios.get(`${uriPrefix}/user/get-user`, { headers: { authorization: TokenService.getToken() } })
        .then((response) => {
          if (response.data.result) {
            setUser(response.data.user);
          }
          if (response.data.user == null) {
            notify("user not found")
          }
        })
        .catch((error) => {
          console.log(error)
          if (error.response.data.badcredintals && !error.response.data.authorization) {
            navigate("/helix/login")
          }
          if (error.response.data.internalServerError) {
            notify("internal server error")
          }
        })
    }
    getCurrentUser();
  }, [gameisStart, firstBetWin, secondBetWin, aeroplanIsCrashed, firstBetAccepted, secondBetAccepted]);


  // create active tab styling of live bet histories
  useEffect(() => {
    let tabs = document.querySelectorAll(".bet-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((current) => {
          current.classList.remove("active-tab")
        });
        tab.classList.add("active-tab")
      })
    })
  }, [])

  // make notify functions for alert messages and error messages
  const notify = (message) => {
    toast.error(message);
  }

  // set the unity game options
  var { unityProvider, sendMessage, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: process.env.PUBLIC_URL + "/Build/HeliXBuild.loader.js",
    dataUrl: process.env.PUBLIC_URL + "/Build/HeliXBuild.data",
    frameworkUrl: process.env.PUBLIC_URL + "/Build/HeliXBuild.framework.js",
    codeUrl: process.env.PUBLIC_URL + "/Build/HeliXBuild.wasm",
  });
  // call the add event listner function on added any listner in helix build
  useEffect(() => {
    // listen this event on live bet number is update in unity frontend
    addEventListener("GetFloatValue", (betnumber) => {
      let number = parseFloat(betnumber);
      setLiveBetNumber(number);
    });

    // listen event on Helix Game is start after then we are clear live history and add new live history
    addEventListener("GetGameStart", (gameisStart) => {
      setGameIsStart(gameisStart);
    });


    // listen event on Helix aeroplan is crashed
    addEventListener("HelicopterBurstGet", (aeroplanCrash) => {
      // if(aeroplanCrash===1){
      //   deleteAllLiveHistory();
      // }
      setAeroPlanCrash(() => {
        return aeroplanCrash;
      })
    });

    // listen event on Helix Game is Loading
    addEventListener("GetLoadStart", (gameLoading) => {
      setGameIsLoading(gameIsLoading)
    });
  }, [addEventListener, removeEventListener, aeroplanIsCrashed, showFirstBetCancleButton, gameisStart])

  // do delete request to server for deleting the all live hostory on game is over
  const deleteAllLiveHistory = async () => {
    await axios.delete(`${uriPrefix}/bet/delete-livebet-history`)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // get new round id on aeroplan is crash
  const getRoundId = async () => {
    await axios.get(`${uriPrefix}/game/round/get-roundid`)
      .then((response) => {
        console.warn(response);
        if (response.data.result) {
          setNewRoundId(response.data.roundId);
        }
        if (response.data.somethingWrong) {
          notify("something wrong")
        }
      })
      .catch((error) => {
        console.log(error);
      })
  }


  /* if aeroplan is crashed and firstbet is accepted and user not collecting win amount
   then we will call collect function and pass 0  collected money  */
  useEffect(() => {
    if (aeroplanIsCrashed === 1) {
      // delete all Live placed bet histories
      deleteAllLiveHistory();
      // on aeroplan is crashed then we call getRoundId function for geting new Round Id
      getRoundId();
    }
    if (aeroplanIsCrashed === 1 && firstBetAccepted) {
      onCollectFirstBetAmount(0);
    }
  }, [aeroplanIsCrashed])

  /* if aeroplan is crashed and second bet is accepted and user not collecting win amount
  then we will call collect function and pass 0  collected money  */
  useEffect(() => {
    if (aeroplanIsCrashed === 1 && secondBetAccepted) {
      onCollectSecondBetAmount(0);
      setShowSecondBetCollectAmount(false);
    }
  }, [aeroplanIsCrashed])


  /* call the useEffect on every time for check 
  game status like game is start or aeroplan is crashed */
  useEffect(() => {
    let getGameStatus = async () => {
      await axios.get(`${uriPrefix}/game/getgame-status`)
        .then((response) => {
          if (response.data.result) {
            setGameStatus(response.data.gameStatus);
          }
        })
        .catch((error) => {
          console.log(error);
          notify("internal server error")
        })
    }
    getGameStatus();
  }, [liveBetNumber, userBetStatus, firstBetAccepted, secondBetAccepted,
    firstBetWin, secondBetWin])



  // get user placed current bets status
  useEffect(() => {
    let userid = "shubh@gmail.com"
    const getUserCurrentBets = async () => {
      await axios.get(`${uriPrefix}/bet/get-userplaced-betsnumber/${userid}`)
        .then((response) => {
          // set the user placed bet detals
          if (response.data.result) {
            setUserCurrentBets(response.data.placedBetsDetails)
          }

        })
        .catch((error) => {
          console.log(error);
          notify("internal server error")
        })
    }
    // call the getCurrentBets function
    getUserCurrentBets();
  }, [])


  // get the current user bet status for autobet and other automatically operatinos
  const getUserBetStatus = async () => {
    await axios.get(`${uriPrefix}/bet/mybet-status/Demouser1`)
      .then((response) => {
        setUserBetStatus(response.data.betStatus);
        setFirstBetIsAuto(response.data.betStatus.FirstBetIsAuto);
        setSecondBetIsAuto(response.data.betStatus.SecondBetIsAuto);
        setFirstBetIsAutoCollect(response.data.betStatus.FirstBetIsAutoCollect)
        setSecondBetIsAutoCollect(response.data.betStatus.SecondBetIsAutoCollect)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    getUserBetStatus();
  }, [])


  // on user place first bet
  const placeFirstBet = useCallback(async (aeroplanCrash = aeroplanIsCrashed) => {
    /* check condition for place bet while gameis running and aeroplan is not crashed and firstbet is not
    accepted then we will show place bet for next round 
    */
    if (gameisStart !== 0 && aeroplanCrash !== 1 && !firstBetAccepted) {
      setPlaceFirstBetForNextRound(true)
    } else {
      // create place bet object
      setPlaceFirstBetForNextRound(false)
      const firstBetDetails = {
        username: "shubham choudhary",
        email: "shubh@gmail.com",
        betnumber: liveBetNumber,
        betamount: firstbettingAmount,
        roundid: roundId
      }
      // post the bet
      await axios.post(`${uriPrefix}/bet/placefirstbet`, firstBetDetails, config)
        .then((response) => {
          if (response.data.success) {
            // play sound 
            firstBetAudioRef.current?.play();
            setFirstBetAccepted(true);
            setPlaceFirstBetForNextRound(false);
            forceUpdate();
          }
          if (response.data.lowBalance) {
            notify("invalid balance")
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }, [firstBetAccepted, gameisStart, showFirstBetCancleButton, firstbettingAmount])


  // on place second bet
  const placeSecondBet = useCallback(async (aeroplanCrash = aeroplanIsCrashed) => {
    /* check condition for place bet while gameis running and aeroplan is not crashed and second bet
     is not accepted then we will show place bet for next round 
  */

    if (gameisStart != 0 && aeroplanCrash != 1 && !secondBetAccepted) {
      setPlaceSecondBetForNextRound(true)
    } else {
      // create place bet object
      setPlaceSecondBetForNextRound(false)
      const secondBetDetails = {
        username: "shubham choudhary",
        email: "shubh@gmail.com",
        betnumber: liveBetNumber,
        betamount: secondBettingAmount,
        roundid: roundId
      }
      // post the bet details
      await axios.post(`${uriPrefix}/bet/placesecondbet`, secondBetDetails, config)
        .then((response) => {
          if (response.data.success) {
            // play sound 
            secondBetAudioRef.current?.play();
            setSecondBetAccepted(true);
            setShowPlaceSecondBet(false);
            setPlaceSecondBetForNextRound(false);
            forceUpdate();
          }
          if (response.data.lowBalance) {
            notify("invalid balance")
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [secondBetAccepted, gameisStart, showSecondBetCancleButton, secondBettingAmount])



  //   // post the bet is auto bet or not on user integreate with auto bet switch
  const onPostAutoBetStatus = async (firstBetAutoStatus, secondBetAutoStatus) => {
    let betStatus = {
      userid: "Demouser1",
      firstBetIsAuto: firstBetAutoStatus,
      secondBetIsAuto: secondBetAutoStatus,
      firstBetIsAutoCollect: false,
      secondBetIsAutoCollect: false
    };
    try {
      const response = await axios.post(`${uriPrefix}/bet/set-betstatus`, betStatus, config);
    } catch (error) {
      console.log(error);
    }
  };

  // update the first bet status and post the bet status
  const onFirstBetAuto = (e) => {
    setFirstBetIsAuto((previous) => {
      if (previous) {
        setFirstBetAccepted(false);
      }
      const firstBetStatus = !previous;
      onPostAutoBetStatus(firstBetStatus, secondBetIsAuto);
      return firstBetStatus;
    });
  };

  // update the second bet status and post the bet status
  const onSecondBetAuto = (e) => {
    setSecondBetIsAuto((previous) => {
      if (previous) {
        setSecondBetAccepted(false);
      }
      const secondeBetStatus = !previous;
      onPostAutoBetStatus(firstBetIsAuto, secondeBetStatus);
      return secondeBetStatus;
    });
  };



  // place bet automatically when user enable autobet switch
  const intervalRef = useRef(null);
  useEffect(() => {
    // Ensure that the conditions are met before setting the interval
    if (firstBetIsAuto && aeroplanIsCrashed === 1 && gameIsLoading === 0 && !firstBetAccepted &&
      !firstBetWin) {
      // Set interval only once using useRef to prevent multiple intervals
      // Clear existing interval before setting a new one
      clearInterval(intervalRef.current);
      // Set a new interval
      intervalRef.current = setInterval(() => {
        placeFirstBet();
      }, 2000);
      // Clear the interval when component unmounts or conditions change
      return () => clearInterval(intervalRef.current);
    }
  }, [aeroplanIsCrashed, firstBetAccepted, firstBetWin, gameIsLoading, firstBetCollectingAmount,
    firstBetIsAuto]);



  // place bet automatically when user enable autobet switch
  const secondintervalRef = useRef(null);
  useEffect(() => {
    // Ensure that the conditions are met before setting the interval
    if (secondBetIsAuto && aeroplanIsCrashed === 1 && gameIsLoading === 0 && !secondBetAccepted
      && !secondBetWin) {
      // Set interval only once using useRef to prevent multiple intervals
      // Clear existing interval before setting a new one
      clearInterval(secondintervalRef.current);
      // Set a new interval
      secondintervalRef.current = setInterval(() => {
        placeSecondBet();
      }, 1000);
      // Clear the interval when component unmounts or conditions change
      return () => clearInterval(secondintervalRef.current);
    }
  }, [aeroplanIsCrashed, secondBetAccepted, secondBetWin, gameIsLoading, secondBetCollectingAmount,
    secondBetIsAuto]);




  // calculate the user first bet out amount for collect the win money
  useEffect(() => {
    let total = ((firstbettingAmount) * (liveBetNumber)).toFixed(2)
    setFirstBetCollectingAmount(total)
  }, [liveBetNumber]);
  // calculate the user second bet our amount for collect the win money
  useEffect(() => {
    let total = ((secondBettingAmount) * (liveBetNumber)).toFixed(2)
    setSecondBetCollectingAmount(total)
  }, [liveBetNumber]);


  // on collect first bet amout successfully
  const onCollectFirstBetAmount = async (winamount) => {
    // create the winnig bet details object
    const winingDetails = {
      email: "shubh@gmail.com",
      winingstatus: "win",
      lossamount: "0",
      winamount: winamount,
      isFirstBet: true,
      isSecondBet: false
    }
    // post details to server for saving winging bet history
    await axios.post(`${uriPrefix}/bet/firstbet-win`, winingDetails, config)
      .then((response) => {
        // on win the bet we are store history
        if (response.data.success) {
          getUserBetStatus();
          setFirstBetAccepted(false);
          setFirstBetWinAmount(firstBetCollectingAmount);
          setShowFirstBetCollectAmount(false);
          setShowPlaceFirstBet(true);
          forceUpdate();
          // check user is win or not if user win with 0 money then we are set win status
          if (winamount > 0) {
            setFirstBetWin(true)
          } else {
            setFirstBetWin(false)
          }
          // hide the win info card
          setTimeout(() => {
            setFirstBetWin(false);
          }, 1500);
        }
      })
      .catch((error) => {
        throw error;
        notify("internal server error")
      })
  }

  // on collect second bet amout
  const onCollectSecondBetAmount = async (winamount) => {
    // create the winnig bet details object
    const winingDetails = {
      email: "shubh@gmail.com",
      winingstatus: "win",
      lossamount: "0",
      winamount: winamount,
      isFirstBet: true,
      isSecondBet: false
    }
    // post details to server for saving winging bet history
    await axios.post(`${uriPrefix}/bet/secondbet-win`, winingDetails, config)
      .then((response) => {
        // on win the bet we are store history
        if (response.data.success) {
          setSecondBetAccepted(false);
          setSecondBetWinAmount(secondBetCollectingAmount);
          setShowSecondBetCollectAmount(false);
          setShowPlaceSecondBet(true);
          getUserBetStatus();
          forceUpdate();

          // hide the win info card
          if (winamount > 0) {
            setSecondBetWin(true)
          } else {
            setSecondBetWin(false)
          }
          setTimeout(() => {
            setSecondBetWin(false);
          }, 1500);
        }
      })
      .catch((error) => {
        throw error;
        console.log(error);
        notify("internal server error")
      })
  }


  // post the bet is auto collect or not on user integreate with auto collect switch
  const onPostAutoCollectStatus = async (firstBetAutoCollectStatus, secondBetAutoCollectStatus) => {
    let betStatus = {
      userid: "Shubh@123",
      firstBetIsAuto: firstBetIsAuto,
      secondBetIsAuto: secondBetIsAuto,
      firstBetIsAutocCollect: firstBetAutoCollectStatus,
      secondBetIsAutoCollect: secondBetAutoCollectStatus
    };
    try {
      const response = await axios.post(`${uriPrefix}/bet/set-betstatus`, betStatus, config);
    } catch (error) {
      console.log(error);
      notify("internal server error")
    }
  }


  // post the first bet is auto collect for update the bet status
  const onFirstBetAutoCollect = (e) => {
    setFirstBetIsAutoCollect((previous) => {
      let firstAutoCollectStatus = !previous;
      onPostAutoCollectStatus(firstAutoCollectStatus, secondBetIsAutoCollect);
      return firstAutoCollectStatus;
    });
  }


  // post the first bet is auto collect for update the bet status
  const onSecondBetAutoCollect = (e) => {
    setSecondBetIsAutoCollect((previous) => {
      let secondAutoCollectStatus = !previous;
      onPostAutoCollectStatus(firstBetIsAutoCollect, secondAutoCollectStatus);
      return secondAutoCollectStatus;
    });
  }



  /* if auto collect is on then we are check user enter auto collect bet number is equal to live 
  current bet number if is true then we are call the win function and pass win amount
  */
  // This effect handles the auto-collecting of the first bet.
  useEffect(() => {
    const liveNumber = parseFloat(liveBetNumber);
    const autoCollectNumber = parseFloat(firstBetAutoCollectBetNumber);
    // Make sure we're in the right state to auto-collect.
    if (firstBetIsAutoCollect && firstBetAccepted && gameisStart === 1) {
      // Define a small range for comparison to handle floating-point imprecision.
      const delta = 0.01; // This delta should be small enough for your game's precision requirements.
      // Check if the live number is close enough to the target number to consider them equal.
      if (Math.abs(liveNumber - autoCollectNumber) < delta) {
        // Call the function to handle the auto-collect.
        onCollectFirstBetAmount(firstBetCollectingAmount);
      }
    }
    // Include only the relevant dependencies.
  },
    [firstBetIsAutoCollect, firstBetAccepted, firstBetAutoCollectBetNumber, firstBetCollectingAmount,
      gameisStart]);

  /* if auto collect is on then we are check user enter auto collect bet number is equal to live 
current bet number if is true then we are call the win function and pass win amount
*/
  // This effect handles the auto-collecting of the second bet.
  useEffect(() => {
    const liveNumber = parseFloat(liveBetNumber);
    const autoCollectNumber = parseFloat(secondBetAutoCollectBetNumber);
    // Make sure we're in the right state to auto-collect.
    if (secondBetIsAutoCollect && secondBetAccepted && gameisStart === 1) {
      // Define a small range for comparison to handle floating-point imprecision.
      const delta = 0.01; // This delta should be small enough for your game's precision requirements.
      // Check if the live number is close enough to the target number to consider them equal.
      if (Math.abs(liveNumber - autoCollectNumber) < delta) {
        // Call the function to handle the auto-collect.
        onCollectSecondBetAmount(secondBetCollectingAmount);
      }
    }
    // Include only the relevant dependencies.
  },
    [secondBetIsAutoCollect, secondBetAccepted, secondBetAutoCollectBetNumber, secondBetCollectingAmount,
      gameisStart]);



  // if game is over then we are set 0 values on Win Amount
  useEffect(() => {
    if (aeroplanIsCrashed) {
      setFirstBetCollectingAmount(0);
      setSecondBetCollectingAmount(0);
    }
  }, [liveBetNumber, aeroplanIsCrashed])

  // if user bet is placed and game is start then we are show win amount on collect amount button
  useEffect(() => {
    if (firstBetAccepted && gameisStart === 1) {
      setShowFirstBetCollectAmount(true);
    }
  }, [firstBetAccepted, gameisStart]);

  // if user bet is placed and game is start then we are show win amount on collect amount button
  useEffect(() => {
    if (firstBetAccepted && !showFirstBetCancleButton && gameisStart === 1 && gameIsLoading === 1) {
      setShowFirstBetCollectAmount(true);
    }
  }, [aeroplanIsCrashed, firstBetAccepted, showFirstBetCancleButton]);

  // if user bet is placed and game is start then we are show win amount on collect amount button
  useEffect(() => {
    if (secondBetAccepted && gameisStart === 1) {
      setShowSecondBetCollectAmount(true);
    }
  }, [secondBetAccepted, gameisStart]);


  //check conditions for place bet for next Round
  useEffect(() => {
    if (gameisStart === 1 && aeroplanIsCrashed != 1) {
      setPlaceFirstBetForNextRound(true);
      setPlaceSecondBetForNextRound(true);
      setShowPlaceFirstBet(false);
      setShowPlaceSecondBet(false)
    } else {
      setPlaceFirstBetForNextRound(false);
      setPlaceSecondBetForNextRound(false);
      setShowPlaceFirstBet(true);
      setShowPlaceSecondBet(true)
    }
  }, [gameisStart, aeroplanIsCrashed, addEventListener, firstBetCollectingAmount,
    secondBetCollectingAmount])



  // place first bet for next round
  let onPlaceFirstBetForNextRound = useCallback(() => {
    setShowFirstBetCancleButton(!showFirstBetCancleButton);
  }, [aeroplanIsCrashed, placeFirstBet, showFirstBetCancleButton]);

  useEffect(() => {
    if (showFirstBetCancleButton) {
      if (aeroplanIsCrashed === 1) {
        setShowFirstBetCancleButton((prev) => {
          let updatedCancleButton = !prev;
          setAeroPlanCrash(aeroplanIsCrashed)
          placeFirstBet(aeroplanIsCrashed);
          return updatedCancleButton;
        })
      }
    }
  }, [aeroplanIsCrashed])

  // place second bet for next round
  let onPlaceSecondBetForNextRound = useCallback(() => {
    setShowSecondBetCancleButton(!showSecondBetCancleButton);
  }, [aeroplanIsCrashed, placeSecondBet, showSecondBetCancleButton]);

  useEffect(() => {
    if (showSecondBetCancleButton) {
      if (aeroplanIsCrashed === 1) {
        setShowSecondBetCancleButton((prev) => {

          let updatedCancleButton = !prev;
          setAeroPlanCrash(aeroplanIsCrashed)
          placeSecondBet(aeroplanIsCrashed);
          return updatedCancleButton;
        })
      }
    }
  }, [aeroplanIsCrashed])

  // cancle place first bet for next round on user cancle the next round
  const cancleFirstPlaceBetForNextRound = useCallback(() => {
    setShowFirstBetCancleButton(!showFirstBetCancleButton);
    setShowFirstBetCollectAmount(false);
    if (gameisStart === 1 && !showFirstBetCancleButton) {
      setShowPlaceFirstBet(false);
      setPlaceFirstBetForNextRound(true);
      if (firstBetAccepted) {
        setFirstBetAccepted(false);
      }
    }
  }, [aeroplanIsCrashed, gameisStart, showFirstBetCancleButton])

  // cancle place bet for next round on user cancle the second bet
  const cancelSecondPlaceBetForNextRound = useCallback(() => {
    setShowSecondBetCancleButton(!showSecondBetCancleButton);
    setShowSecondBetCollectAmount(false);
    if (gameisStart === 1 && !showSecondBetCancleButton) {
      setShowPlaceSecondBet(false);
      setPlaceSecondBetForNextRound(true);
      if (secondBetAccepted) {
        setSecondBetAccepted(false);
      }
    }
  }, [aeroplanIsCrashed, gameisStart, showSecondBetCancleButton]);


  // get the plan crash histories on aeroplan is crashed 
  useEffect(() => {
    const getPlanCrashBetHistories = async () => {
      await axios.get(`${uriPrefix}/game/get-aeroplancrash-histories`)
        .then((response) => {
          if (response.data.result) {
            setPlanCrashHistories(response.data.histories.bets)
          }
        })
        .catch((error) => {
          console.log(error);
          notify("internal server error")
        })
    }
    // call the function for geting crashed plan bet histories
    getPlanCrashBetHistories();
  }, [aeroplanIsCrashed])



  const onPlusFirstBetAutoCollectBetNumber = () => {
    // Find the index of the current value in the array
    const currentIndex = firstBetAutoCollectNumbers.indexOf(firstBetAutoCollectBetNumber);

    // If the current value is found in the array, get the next value, else start from the beginning
    if (currentIndex === firstBetAutoCollectNumbers.length - 1) {
      setFirstBetAutoCollectBetNumber(firstBetAutoCollectNumbers[0])
    } else {
      let newIndex = currentIndex + 1;
      let nextValue = firstBetAutoCollectNumbers[newIndex];
      // Update the state with the next value
      setFirstBetAutoCollectBetNumber(nextValue);
    }
  };


  const onPlusSecondBetAutoCollectBetNumber = () => {
    // Find the index of the current value in the array
    const currentIndex = secondBetAutoCollectNumbers.indexOf(secondBetAutoCollectBetNumber);

    // If the current value is found in the array, get the next value, else start from the beginning
    if (currentIndex === secondBetAutoCollectNumbers.length - 1) {
      setSecondBetAutoCollectBetNumber(secondBetAutoCollectNumbers[0])
    } else {
      let newIndex = currentIndex + 1;
      let nextValue = secondBetAutoCollectNumbers[newIndex];
      // Update the state with the next value
      setSecondBetAutoCollectBetNumber(nextValue);
    }
  };
  // back a auto collect number from autocollect bet number array
  const onDecreaseFirstAutoCollectBetNumber = () => {
    let currentIndex = firstBetAutoCollectNumbers.indexOf(firstBetAutoCollectBetNumber);
    let newIndex = currentIndex - 1;
    let nextValue = firstBetAutoCollectNumbers[newIndex];
    setFirstBetAutoCollectBetNumber(nextValue)

  }
  // back a auto collect number from autocollect bet number array
  const onDecreaseSecondAutoCollectBetNumber = () => {
    let currentIndex = secondBetAutoCollectNumbers.indexOf(secondBetAutoCollectBetNumber);
    let newIndex = currentIndex - 1;
    let nextValue = secondBetAutoCollectNumbers[newIndex];
    setSecondBetAutoCollectBetNumber(nextValue)

  }

  // enable the input field when coponent is loaded
  const inputRef = useRef();
  useEffect(() => {
    // Focus on an input field using a React ref after Unity WebGL is loaded
    inputRef.current.focus();
  }, [addEventListener, removeEventListener]);



  return <>

    <section className="gameboard-section">
      <Toaster toastOptions={{ className: 'Toaster' }} />
      <div className="gameboard-container">
        <div className="game-section">
          <Navbar firstBetAccepted={firstBetAccepted} secondBetAccepted={secondBetAccepted}
            firstBetWin=
            {firstBetWin} secondBetWin={secondBetWin} />
          <div className="game-history-header">
            <div className='histories' id='history-box'>
              {/* <OwlCarousel id="customer-testimonoals" className="owl-carousel owl-theme" {...options}> */}
              {
                planCrashHistories?.map((bet, index) => {
                  return <div key={index} style={{ color: index % 2 == 0 ? "#DF0000" : "#fff" }} className='history'>{bet}x </div>
                })
              }
              {/* </OwlCarousel> */}
            </div>
            <div className="history-btn">
              <img src={process.env.PUBLIC_URL + "/Photos/webPhotos/history-btn.png"} alt="" />
            </div>
          </div>
          <div className="unity-game-box">
            <div className="canvas">
              <Unity style={{
                margin: 'auto'
              }} className='unity' unityProvider={unityProvider} />
            </div>
          </div>

          {/* game controllers */}

          <div className="game-controllers-section">
            <div className="gamecontrollers-container">
              <div className="left-controllers">
                {/* audio is play on user place bet and bet is accepted */}
                <audio ref={firstBetAudioRef} src={process.env.PUBLIC_URL + "/Audios/placebet.mp3"}></audio>
                <div className="play-bet-controllers">
                  {firstBetAccepted || showFirstBetCancleButton ? <div className="disabled-layer"></div> : ""}
                  <div className="auto-bet">
                    <div className="autobet-btn-header">
                      {/* {firstBetAccepted || showFirstBetCancleButton ? <div className="disabled-layer"></div> : ""} */}
                      <div className='speed' onClick={() => setFirstBettingAmount(firstbettingAmount * 2)}>X<span>2</span></div>
                      <div className="info autobet-btn">
                        <div className='title'>auto bet</div>
                        <div className="switch">
                          <CustomSwitch
                            checked={firstBetIsAuto}
                            value={firstBetIsAuto}
                            onChange={onFirstBetAuto}
                            disabled={firstBetAccepted || showFirstBetCancleButton}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="autobet-controller">
                      {/* {firstBetAccepted || showFirstBetCancleButton ? <div className="disabled-layer"></div> : ""} */}
                      <button
                        className={firstbettingAmount < 11 ? 'decrease disabled' : 'decrease'}
                        disabled={showPlaceFirstBet ? false : true}
                        disabled={firstBetAccepted ? true : false}
                        disabled={firstbettingAmount < 11 ? true : false}
                        onClick={() => setFirstBettingAmount(firstbettingAmount - 5)}>
                        <i class="uil uil-minus"></i>
                      </button>
                      <div className="bet-value">

                        <input type="number"
                          ref={inputRef}
                          value={firstbettingAmount}
                          onChange={(e) => setFirstBettingAmount(e.target.value)}
                        />
                      </div>
                      <button disabled={showPlaceFirstBet ? false : true} disabled={firstBetAccepted ? true : false}
                        onClick={() => setFirstBettingAmount(firstbettingAmount + 5)} className="increase">+</button>
                    </div>
                  </div>
                  <div className="auto-collect">
                    <div className="autocollect-btn-header">
                      {/* {firstBetAccepted || showFirstBetCancleButton ? <div className="disabled-layer"></div> : ""} */}
                      <div className="autocollect-btn">
                        <div className="title">
                          auto collect
                        </div>
                        <div className="switch">
                          <CustomSwitch
                            checked={firstBetIsAutoCollect}
                            value={firstBetIsAutoCollect}
                            onChange={onFirstBetAutoCollect}
                            disabled={firstBetAccepted || showFirstBetCancleButton}
                          />
                        </div>

                      </div>
                    </div>
                    <div className="autocollect-controller">
                      {/* {firstBetAccepted || showFirstBetCancleButton ? <div className="disabled-layer"></div> : ""} */}
                      <button
                        onClick={onDecreaseFirstAutoCollectBetNumber}
                        disabled={firstBetAccepted || showFirstBetCancleButton ? true : false}
                        disabled={firstBetAutoCollectBetNumber === firstBetAutoCollectNumbers[0] ? true : false}
                        className={firstBetAutoCollectBetNumber === firstBetAutoCollectNumbers[0] ? "decrease disabled" : "decrease"}
                      >
                        <i class="uil uil-minus"></i></button>
                      <div className="bet-value">{firstBetAutoCollectBetNumber}x</div>
                      <button
                        onClick={onPlusFirstBetAutoCollectBetNumber}
                        disabled={firstBetAccepted || showFirstBetCancleButton ? true : false}
                        disabled={firstBetAutoCollectBetNumber == firstBetAutoCollectNumbers[firstBetAutoCollectNumbers.length - 1] ? true : false}
                        className={firstBetAutoCollectBetNumber == firstBetAutoCollectNumbers[firstBetAutoCollectNumbers.length - 1] ? "increase disabled" : "increase"}
                      >+</button>
                    </div>
                  </div>
                </div>
                <div className="autobet-values-place-bet-btn">
                  <div className="autobet-betvalues">
                    {firstBetAccepted || showFirstBetCancleButton ? <div className="disabled-layer"></div> : ""}
                    <button className="betvalue" disabled={firstBetAccepted || showFirstBetCancleButton ? true : false} onClick={() => setFirstBettingAmount(20)}>20.00</button>
                    <button className="betvalue" disabled={firstBetAccepted || showFirstBetCancleButton ? true : false} onClick={() => setFirstBettingAmount(50)}>50.00</button>
                    <button className="betvalue" disabled={firstBetAccepted || showFirstBetCancleButton ? true : false} onClick={() => setFirstBettingAmount(100)}>100.00</button>
                    <button className="betvalue" disabled={firstBetAccepted || showFirstBetCancleButton ? true : false} onClick={() => setFirstBettingAmount(user?.Balance.toFixed(2))}>All</button>
                  </div>
                  <div className="placebet-btn">
                    <audio id='first-bet-placed-audio' controls={false}>
                      <source src={process.env.PUBLIC_URL + "/Audios/placebet.mp3"} type="audio/ogg" />
                    </audio>
                    <button onClick={placeFirstBet}
                      hidden={showPlaceFirstBet && !showFirstBetCancleButton && !showFirstBetCollectAmount
                        && !firstBetAccepted && !placeFirstBetForNextRound
                        ? false : true}>
                      place your bet
                    </button>
                    <button onClick={onPlaceFirstBetForNextRound} className='nextround-btn'
                      hidden={!firstBetAccepted && !showFirstBetCollectAmount &&
                        placeFirstBetForNextRound && !showPlaceFirstBet && !showFirstBetCancleButton ? false : true}>
                      place bet
                      <div className="for-nextround-text"> for next round</div>
                    </button>

                    <button onClick={cancleFirstPlaceBetForNextRound} hidden={showFirstBetCancleButton ? false : true} className='nextround-cancle-btn'>
                      cancel
                    </button>

                    <button className='bet-accepted-btn'
                      hidden={firstBetAccepted && !showFirstBetCancleButton && !showFirstBetCollectAmount ?
                        false : true}>
                      <div>bet</div>
                      <div>accepted</div>
                    </button>
                    <button className='collect-amount-btn' onClick={() => onCollectFirstBetAmount(firstBetCollectingAmount)}
                      hidden={showFirstBetCollectAmount && !showFirstBetCancleButton ? false : true}>
                      <div className="collect-value"> {firstBetCollectingAmount} DEMO</div>
                      <div className="collect-text"> collect</div>
                    </button>
                  </div>
                </div>
                {
                  firstBetWin ? <Wincard amount={firstBetWinAmount} position={"left"} /> : ""
                }

              </div>
              <div className="right-controllers">
                {/* audio is play on user place bet and bet is accepted */}
                <audio ref={secondBetAudioRef} src={process.env.PUBLIC_URL + "/Audios/placebet.mp3"}></audio>
                <audio ref={secondBetAudioRef} src={process.env.PUBLIC_URL + "/Audios/placebet.mp3"}></audio>
                <div className="play-bet-controllers">
                  {secondBetAccepted || showSecondBetCancleButton ? <div className="disabled-layer"></div> : ""}
                  <div className="auto-bet">
                    <div className="autobet-btn-header">
                      {/* {secondBetAccepted || showSecondBetCancleButton ? <div className="disabled-layer"></div> : ""} */}
                      <div className='speed' onClick={() => setSecondBettingAmount(secondBettingAmount * 2)}>X<span>2</span></div>
                      <div className="info autobet-btn">
                        <div className="title">      auto bet</div>
                        <div className="switch">
                          <CustomSwitch
                            checked={secondBetIsAuto}
                            value={secondBetIsAuto}
                            onChange={onSecondBetAuto}
                            disabled={secondBetAccepted || showSecondBetCancleButton ? true : false}
                          />
                        </div>

                      </div>
                    </div>
                    <div className="autobet-controller">
                      {/* {secondBetAccepted || showSecondBetCancleButton ? <div className="disabled-layer"></div> : ""} */}
                      <button
                        disabled={secondBetAccepted || showSecondBetCancleButton ? true : false}
                        className={secondBettingAmount < 11 ? 'decrease disabled' : 'decrease'}
                        disabled={showPlaceSecondBet ? false : true}
                        disabled={secondBettingAmount < 11 ? true : false} onClick={() => setSecondBettingAmount(secondBettingAmount - 5)}><i class="uil uil-minus"></i>
                      </button>
                      <div className="bet-value">
                        <input type="number" value={secondBettingAmount}
                          onChange={(e) => setSecondBettingAmount(e.target.value)} />
                      </div>
                      <button
                        disabled={secondBetAccepted || showSecondBetCancleButton ? true : false}
                        disabled={showPlaceFirstBet ? false : true}
                        onClick={() => setSecondBettingAmount(secondBettingAmount + 5)}
                        className="increase">+</button>
                    </div>
                  </div>
                  <div className="auto-collect">
                    <div className="autocollect-btn-header">
                      {/* {secondBetAccepted || showSecondBetCancleButton ? <div className="disabled-layer"></div> : ""} */}
                      <div className="autocollect-btn">
                        <div className="title">
                          auto collect
                        </div>
                        <div className="switch">
                          <CustomSwitch
                            checked={secondBetIsAutoCollect}
                            value={secondBetIsAutoCollect}
                            onChange={onSecondBetAutoCollect}
                            disabled={secondBetAccepted || showSecondBetCancleButton}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="autocollect-controller">
                      {/* {secondBetAccepted || showSecondBetCancleButton ? <div className="disabled-layer"></div> : ""} */}
                      <button
                        onClick={onDecreaseSecondAutoCollectBetNumber}
                        disabled={secondBetAccepted || showSecondBetCancleButton ? true : false}
                        disabled={secondBetAutoCollectBetNumber === secondBetAutoCollectNumbers[0] ? true : false}
                        className={secondBetAutoCollectBetNumber === secondBetAutoCollectNumbers[0] ? "decrease disabled" : "decrease"}
                      >
                        <i class="uil uil-minus"></i>
                      </button>
                      <div className="bet-value">{secondBetAutoCollectBetNumber}x</div>
                      <button
                        disabled={secondBetAccepted || showSecondBetCancleButton ? true : false}
                        onClick={onPlusSecondBetAutoCollectBetNumber}
                        disabled={secondBetAutoCollectBetNumber === secondBetAutoCollectNumbers[secondBetAutoCollectNumbers.length - 1] ? true : false}
                        className={secondBetAutoCollectBetNumber === secondBetAutoCollectNumbers[secondBetAutoCollectNumbers.length - 1] ? "increase disabled" : "increase"}>
                        +</button>
                    </div>
                  </div>
                </div>
                <div className="autobet-values-place-bet-btn">
                  <div className="autobet-betvalues">
                    {secondBetAccepted || showSecondBetCancleButton ? <div className="disabled-layer"></div> : ""}
                    <button disabled={secondBetAccepted || showSecondBetCancleButton ? true : false}
                      className="betvalue" onClick={() => setSecondBettingAmount("20")}>20.00</button>
                    <button disabled={secondBetAccepted || showSecondBetCancleButton ? true : false}
                      className="betvalue" onClick={() => setSecondBettingAmount("50")}>50.00</button>
                    <button disabled={secondBetAccepted || showSecondBetCancleButton ? true : false}
                      className="betvalue" onClick={() => setSecondBettingAmount("100")}>100.00</button>
                    <button disabled={secondBetAccepted || showSecondBetCancleButton ? true : false}
                      className="betvalue" onClick={() => setSecondBettingAmount(user?.Balance.toFixed(2))}>All</button>
                  </div>
                  <div className="placebet-btn">
                    <audio id='first-bet-placed-audio' controls={false}>
                      <source src={process.env.PUBLIC_URL + "/Audios/placebet.mp3"} type="audio/ogg" />
                    </audio>
                    <button onClick={placeSecondBet}
                      hidden={showPlaceSecondBet && !showSecondBetCollectAmount && !showSecondBetCancleButton
                        && !secondBetAccepted && !placeSecondBetForNextRound
                        ? false : true}>
                      place your bet
                    </button>
                    <button className='nextround-btn' onClick={onPlaceSecondBetForNextRound}
                      hidden={!secondBetAccepted && !showSecondBetCollectAmount && !showSecondBetCancleButton &&
                        placeSecondBetForNextRound && !showPlaceSecondBet ? false : true}>
                      place bet
                      <div className="for-nextround-text"> for next round</div>
                    </button>
                    <button onClick={cancelSecondPlaceBetForNextRound} hidden={showSecondBetCancleButton ? false : true} className='nextround-cancle-btn'>
                      cancel
                    </button>

                    <button className='bet-accepted-btn'
                      hidden={secondBetAccepted && !showSecondBetCollectAmount && !showSecondBetCancleButton ?
                        false : true}>
                      <div>bet</div>
                      <div>accepted</div>
                    </button>
                    <button className='collect-amount-btn' onClick={() => onCollectSecondBetAmount(secondBetCollectingAmount)}
                      hidden={showSecondBetCollectAmount && !showSecondBetCancleButton ? false : true}>
                      <div className="collect-value"> {secondBetCollectingAmount} DEMO</div>
                      <div className="collect-text"> collect</div>
                    </button>

                  </div>
                </div>
                {
                  secondBetWin ? <Wincard amount={secondBetWinAmount} position={"right"} /> : ""
                }
              </div>
            </div>
          </div>
        </div>
        <div className="gamebets-section">
          <div className="gamebets-tabs">
            <button className='bet-tab active-tab' onClick={() => setHistory("ALL_BETS")}>bets all</button>
            <button className='bet-tab' onClick={() => setHistory("MY_BETS")}>my bets</button>
            <button className='bet-tab' onClick={() => setHistory("TOP_BETS")}>top</button>
          </div>
          <div className="gamebets-details">
            {history === "ALL_BETS" ?
              <Suspense fallback={<ClipLoader size={30} color='#fff' className='bets-loader' />}>
                <AllBets value={reducerValue} firstBetAccepted={firstBetAccepted}
                  secondBetAccepted={secondBetAccepted} />
              </Suspense>
              : ""}
            {history === "MY_BETS" ?
              <Suspense fallback={<ClipLoader size={30} color='#fff' className='bets-loader' />}>
                <UserBets value={reducerValue} firstBetAccepted={firstBetAccepted}
                  secondBetAccepted={secondBetAccepted} />
              </Suspense>
              : ""}
            {history === "TOP_BETS" ?
              <Suspense fallback={<ClipLoader size={30} color='#fff' className='bets-loader' />}>
                <TopBets value={reducerValue} />
              </Suspense>

              : ""}
          </div>
        </div>
      </div>

    </section>

  </>
}

export default Gameboard
