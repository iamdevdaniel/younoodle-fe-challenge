import { IDBPCursorWithValue } from 'idb'

import { iterateDbWithCursor } from '../dataAccess/idbManager'
import { Investor, InvestorRecord, MatchedStartup, Startup } from '../types'

const MAX_STARTUP_COUNT = 10

const classifyInvestors = async () => {
    const specificIndustryInvestors: Array<InvestorRecord> = []
    const anyIndustryInvestors: Array<InvestorRecord> = []

    await iterateDbWithCursor(
        'matcher-db',
        'investors',
        async (investorCursor: IDBPCursorWithValue) => {
            const investor = {
                key: investorCursor.key as number,
                value: investorCursor.value,
            }
            if (investor.value.industry === 'any') {
                anyIndustryInvestors.push(investor)
            } else {
                specificIndustryInvestors.push(investor)
            }
        },
    )

    return [specificIndustryInvestors, anyIndustryInvestors]
}

const matchStartups = async (
    investor: { key: number; value: Investor },
    matchedStartups: Map<IDBValidKey, MatchedStartup>,
) => {
    let startupCount = 0

    await iterateDbWithCursor(
        'matcher-db',
        'startups',
        async (startupCursor: IDBPCursorWithValue) => {
            if (startupCount >= MAX_STARTUP_COUNT) {
                return
            }

            const {
                key,
                value,
            }: { key: IDBValidKey; value: Startup | MatchedStartup } =
                startupCursor
            const isSameIndustry = investor.value.industry === value.industry
            const isInvestorAnyIndustry = investor.value.industry === 'any'
            const matchesIndustry = isSameIndustry || isInvestorAnyIndustry
            const isStartupMatched = matchedStartups.has(key)

            if (matchesIndustry && !isStartupMatched) {
                const matchedStartup: MatchedStartup = {
                    ...value,
                    status: 'matched',
                    investorId: investor.key,
                }
                matchedStartups.set(key, matchedStartup)
                startupCount++
            }
        },
    )
}

export const matchStartupsWithInvestors = async () => {
    const matchedStartups: Map<IDBValidKey, MatchedStartup> = new Map()

    const [specificIndustryInvestors, anyIndustryInvestors] =
        await classifyInvestors()
    const allInvestors = [...specificIndustryInvestors, ...anyIndustryInvestors]

    for (const investor of allInvestors) {
        await matchStartups(investor, matchedStartups)
    }

    console.log(matchedStartups)
}
