import React from 'react'

import InvestorCard from '../components/InvestorCard'
import { getMatchedStartupsForInvestors } from '../services/pagination'
import {
    MatchedStartupRecord,
    InvestorRecord,
    InvestorWithStartups,
} from '../types'
import './MatchedStartups.css'

const ITEMS_PER_SCROLL = 12

export const MatchedStartups: React.FC = () => {
    const [matches, setMatches] = React.useState<InvestorWithStartups[]>([])
    const [startId, setStartId] = React.useState(1)

    const fetchData = async () => {
        const result = await getMatchedStartupsForInvestors(
            startId,
            ITEMS_PER_SCROLL,
        )
        setMatches(prevMatches => [...prevMatches, ...result])
        if (result.length > 0) {
            const lastItem = result[result.length - 1]
            const nextStartId = (lastItem.investor.key as number) + 1
            setStartId(nextStartId)
        }
    }

    React.useEffect(() => {
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
            <button name="add-matched-investor" onClick={fetchData}>
                +
            </button>
        </section>
    )
}
