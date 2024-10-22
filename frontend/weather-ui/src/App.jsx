import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import WeatherDisplay from './component/weatherdisplay'
import { SnackbarProvider } from 'notistack';

function App() {
  

  return (
    <>
    
     <SnackbarProvider maxSnack={3}>
            <WeatherDisplay/>
        </SnackbarProvider>

       
        
    </>

  )
}

export default App
