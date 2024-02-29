import React from 'react'

import './App.css'
import { initializeStores, loadCsvFilesToDb } from './services/dbInitialization'
import { matchStartupsWithInvestors } from './services/investorMatcher'
import { MatchedStartups } from './views/MatchedStartups'

type AppContextType = {
    isAppInitialized: boolean
}
export const AppContext = React.createContext<AppContextType>({
    isAppInitialized: false,
})

const initApp = async (
    setContext: React.Dispatch<React.SetStateAction<AppContextType>>,
) => {
    initializeStores()
        .then(loadCsvFilesToDb)
        .then(matchStartupsWithInvestors)
        .then(isInit => {
            setContext(context => ({ ...context, isAppInitialized: isInit }))
        })
}

function App() {
    const [context, setStateContext] = React.useState({
        isAppInitialized: false,
    })

    React.useEffect(() => {
        initApp(setStateContext)
    }, [])

    return (
        <div className="App">
            <AppContext.Provider value={context}>
                <MatchedStartups />
            </AppContext.Provider>
        </div>
    )
}

export default App
