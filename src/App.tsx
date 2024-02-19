import React from 'react'

import './App.css'
import { initializeStores, loadCsvFilesToDb } from './services/dbInitialization'
import { matchStartupsWithInvestors } from './services/investorMatcher'

const initApp = async () => {
    await initializeStores()
    await loadCsvFilesToDb()
    await matchStartupsWithInvestors()
}

function App() {
    React.useEffect(() => {
        initApp()
    }, [])

    return <div className="App"></div>
}

export default App
