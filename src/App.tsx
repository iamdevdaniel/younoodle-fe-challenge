import React from 'react'

import './App.css'
import { initializeApp } from './services/dbInitialization'
import { matchStartupsWithInvestors } from './services/investorMatcher'

function App() {
    const initApp = async () => {
        await initializeApp()
        await matchStartupsWithInvestors()
    }

    React.useEffect(() => {
        initApp()
    }, [])

    return <div className="App"></div>
}

export default App
