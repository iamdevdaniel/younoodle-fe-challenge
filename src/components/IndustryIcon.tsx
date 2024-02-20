import React from 'react'

import { Industry } from '../types'

const DEFAULT_WIDTH = 38

interface IndustryIconProps {
    industry: Industry | 'any'
}

const IndustryIcon: React.FC<IndustryIconProps> = ({ industry }) => {
    const svgUrl = `/assets/${industry}-industry.svg`

    return (
        <img
            src={svgUrl}
            alt={industry}
            title={industry}
            style={{ width: DEFAULT_WIDTH }}
        />
    )
}

export default IndustryIcon
