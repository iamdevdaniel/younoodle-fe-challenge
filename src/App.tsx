import React from 'react'

import './App.css'
import { initializeApp } from './services/dbInitialization'

function App() {
    React.useEffect(() => {
        initializeApp()
    }, [])

    return <div className="App"></div>
}

export default App
