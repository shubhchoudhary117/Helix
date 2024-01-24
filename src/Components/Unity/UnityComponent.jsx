import React, { useEffect } from 'react'
import { Unity, useUnityContext } from "react-unity-webgl";
const UnityComponent = ({ setLiveBetNumber, setAeroPlanCrash, setGameIsLoading, setGameIsStart }) => {

    // set the unity game options
    var { unityProvider, sendMessage, addEventListener, removeEventListener } = useUnityContext({
        loaderUrl: process.env.PUBLIC_URL + "/Build/HeliX.loader.js",
        dataUrl: process.env.PUBLIC_URL + "/Build/HeliX.data",
        frameworkUrl: process.env.PUBLIC_URL + "/Build/HeliX.framework.js",
        codeUrl: process.env.PUBLIC_URL + "/Build/HeliX.wasm",
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
            setGameIsLoading(gameLoading)
        });
    }, [addEventListener, removeEventListener])
    return <>

        <Unity style={{
            margin: 'auto'
        }} className='unity' unityProvider={unityProvider} />

    </>
}

export default UnityComponent
