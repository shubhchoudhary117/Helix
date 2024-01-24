
import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Dashboard from './Dashboard/Dashboard'
import Navbar from "./Components/Navigation/Navbar"
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Homepage from './Pages/Home/Homepage'
import "./App.css"


const App = () => {
  // change the default color of react material ui components
  const theme = createTheme({
    palette: {
      primary: {
        main: "#C86325"
      },
      secondary: {
        main: "#494c7d"
      },
      info: {
        main: "#fff"
      }
    }
  });

  return <>

    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Dashboard />}>
            <Route path='/' element={<Homepage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  </>
}

export default App
