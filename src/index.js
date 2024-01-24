import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import AppLoader from './Components/Loaders/AppLoader/AppLoader';
const root = ReactDOM.createRoot(document.getElementById('root'));
// lazy loading 
const App=React.lazy(()=>import("./App.js"))
root.render(
  <React.StrictMode>
    <Suspense fallback={<AppLoader/>}>
    <App />
    </Suspense>
 
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
