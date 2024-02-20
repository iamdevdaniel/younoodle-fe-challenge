import React from 'react'

import InvestorCard from '../components/InvestorCard'
import { getMatchedStartupsForInvestors } from '../services/pagination'
import {
    MatchedStartupRecord,
    InvestorRecord,
    InvestorWithStartups,
} from '../types'
import './MatchedStartups.css'

export const MatchedStartups: React.FC = () => {
    const [matches, setMatches] =
        React.useState<Array<InvestorWithStartups>>([])

    React.useEffect(() => {
        const fetchData = async () => {
            const result = await getMatchedStartupsForInvestors()
            setMatches(result)
        }

        fetchData()
    }, [])

    return (
        <section id="matched-startups-view">
            <header id="matched-startups-view-header">
                <h1>Matched Startups</h1>
            </header>
            <div id="investor-card-list">
                {matches.length ? (
                    matches.map((match, index) => {
                        const { investor, startups } = match

                        return (
                            <InvestorCard
                                key={index}
                                investor={investor as InvestorRecord}
                                startups={
                                    startups as Array<MatchedStartupRecord>
                                }
                                overlay={false}
                            />
                        )
                    })
                ) : (
                    <React.Fragment />
                )}
            </div>
            <button name="add-matched-investor">+</button>
        </section>
    )
}
