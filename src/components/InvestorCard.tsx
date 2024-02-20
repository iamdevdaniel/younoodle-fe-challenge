import React from 'react'

import theme from '../theme'
import { InvestorRecord, MatchedStartupRecord } from '../types'

import IndustryIcon from './IndustryIcon'
import StartupPill from './StartupPill'
import './InvestorCard.css'

type InvestorCardProps = {
    investor: InvestorRecord
    startups: Array<MatchedStartupRecord>
    overlay: boolean
}

const InvestorCard: React.FC<InvestorCardProps> = ({
    investor: { key: investorId, value: investor },
    startups,
}) => {
    const industryColors = {
        any: theme['charcoal-1'],
        bio: theme['green-1'],
        internet: theme['blue-1'],
        environment: theme['teal-1'],
    }

    const { name, industry } = investor

    return (
        <div className="investor-card">
            <div
                id="header-line"
                style={{ backgroundColor: industryColors[industry] }}
            />
            <div id="header">
                <h4>{`# ${investorId as number}`}</h4>
                <h5>{name}</h5>
                <IndustryIcon industry={industry} />
            </div>
            <div id="body">
                {startups.map(startup => {
                    const { key: startupId, value } = startup
                    return (
                        <StartupPill
                            key={startupId as number}
                            startup={value}
                            startupId={startupId}
                        />
                    )
                })}
            </div>
        </div>
    )
}

export default InvestorCard
