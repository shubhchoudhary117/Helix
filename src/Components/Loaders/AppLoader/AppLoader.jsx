import React from 'react'
import "./AppLoader.css"
const AppLoader = () => {
  return <>
    
    <section className="loader-section">
      <div className="loader-image-wrapper">
        <img src={process.env.PUBLIC_URL+"/Photos/webPhotos/loadingImg.png"} alt="image is loading" />
      </div>
    </section>
  
  </>
}

export default AppLoader
