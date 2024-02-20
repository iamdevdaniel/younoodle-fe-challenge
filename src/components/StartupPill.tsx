import React from 'react'

import theme from '../theme'
import { MatchedStartup } from '../types'
import './StartupPill.css'

type StartupPillProps = {
    startupId: IDBValidKey
    startup: MatchedStartup
    onAdd: (investorId: number, startupId: number) => {}
    onRemove: (investorId: number, startupId: number) => {}
}

const StartupPill: React.FC<StartupPillProps> = ({
    startupId,
    startup: { name, industry, investorId, status },
    onAdd,
    onRemove,
}) => {
    const industryColors = {
        bio: theme['green-1'],
        internet: theme['blue-1'],
        environment: theme['teal-1'],
    }

    const statusClass = status === 'matched' ? 'matched' : 'removed'
    const industryColor =
        status === 'removed' ? theme['gray-0'] : industryColors[industry]
    const className = `pill ${statusClass}`

    return (
        <div className={className} style={{ borderColor: industryColor }}>
            <span>{name}</span>
            {status === 'matched' && (
                <button
                    onClick={() => onRemove(investorId as number, startupId as number)}
                    className="remove-button"
                    aria-label="Remove"
                >
                    x
                </button>
            )}
            {status === 'removed' && (
                <span
                    onClick={() => onAdd(investorId as number, startupId as number)}
                    className="add-button"
                    aria-label="Add"
                >
                    &#10004;
                </span>
            )}
        </div>
    )
}

export default StartupPill
