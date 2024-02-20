import React from 'react'

import InvestorCard from '../components/InvestorCard'
import { MatchedStartupRecord, InvestorRecord } from '../types'

import { matches } from './mock'

export const MatchedStartups: React.FC = () => (
    <React.Fragment>
        {matches.length ? (
            matches.map((match, index) => {
                const { investor, startups } = match

                return (
                    <InvestorCard
                        key={index}
                        investor={investor as InvestorRecord}
                        startups={startups as Array<MatchedStartupRecord>}
                        overlay={false}
                    />
                )
            })
        ) : (
            <></>
        )}
    </React.Fragment>
)
