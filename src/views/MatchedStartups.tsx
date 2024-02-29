import React from 'react'

import { AppContext } from '../App'
import InvestorCard from '../components/InvestorCard'
import useInfiniteScroll from '../hooks/useInfiniteScroll'
import { getMatchedStartupsForInvestors } from '../services/pagination'
import {
    MatchedStartupRecord,
    InvestorRecord,
    InvestorWithStartups,
} from '../types'
import './MatchedStartups.css'

const ITEMS_PER_SCROLL = 12
const STARTING_ID = 1

export const MatchedStartups: React.FC = () => {
    const [matches, setMatches] = React.useState<InvestorWithStartups[]>([])
    const [startId, setStartId] = React.useState(STARTING_ID)
    const { isAppInitialized } = React.useContext(AppContext)

    const fetchData = async () => {
        const result = await getMatchedStartupsForInvestors(
            startId,
            ITEMS_PER_SCROLL,
        )
        if (result.length > 0) {
            const lastItem = result[result.length - 1]
            const nextStartId = (lastItem.investor.key as number) + 1
            setStartId(nextStartId)
        }
        setMatches(prevMatches => [...prevMatches, ...result])
    }

    const lastInvestorElementRef = useInfiniteScroll(fetchData, startId)

    React.useEffect(() => {
        if (isAppInitialized) {
            fetchData()
        }
    }, [isAppInitialized])

    const hasMatches = matches.length > 0

    return (
        <section id="matched-startups-view">
            <header id="matched-startups-view-header">
                <h1>Matched Startups</h1>
            </header>
            <ul id="investor-card-list">
                {hasMatches ? (
                    matches.map((item, index) => {
                        const match: {
                            investor: InvestorRecord
                            startups: Array<MatchedStartupRecord>
                        } = item
                        const { investor, startups } = match
                        const isLastElement = index === matches.length - 1

                        console.log(match)

                        return (
                            <li
                                ref={
                                    isLastElement
                                        ? lastInvestorElementRef
                                        : null
                                }
                                key={index}
                            >
                                <InvestorCard
                                    investor={investor}
                                    startups={startups}
                                />
                            </li>
                        )
                    })
                ) : (
                    <React.Fragment />
                )}
            </ul>
            <button name="add-matched-investor" aria-label="Add new investor">
                +
            </button>
        </section>
    )
}
