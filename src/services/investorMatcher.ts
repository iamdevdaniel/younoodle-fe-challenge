import { IDBPCursorWithValue, IDBPTransaction, IDBPDatabase } from 'idb'

import { iterateDbWithCursor } from '../dataAccess/idbManager'
import { Investor, MatchedStartup, Startup } from '../types'

const MAX_STARTUP_COUNT = 10

export const matchStartupsWithInvestors = async () => {
    const specificIndustryInvestors: Array<{ key: number; value: Investor }> =
        []
    const anyIndustryInvestors: Array<{ key: number; value: Investor }> = []
    const startupUpdates: Map<IDBValidKey, MatchedStartup> = new Map()

    await iterateDbWithCursor(
        'matcher-db',
        'investors',
        async (investorCursor: IDBPCursorWithValue, _: IDBPDatabase) => {
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

    const allInvestors = [...specificIndustryInvestors, ...anyIndustryInvestors]

    for (const investor of allInvestors) {
        let startupCount = 0

        await iterateDbWithCursor(
            'matcher-db',
            'startups',
            async (startupCursor: IDBPCursorWithValue, db: IDBPDatabase) => {
                if (startupCount >= MAX_STARTUP_COUNT) {
                    return
                }

                const {
                    key,
                    value,
                }: { key: IDBValidKey; value: Startup | MatchedStartup } =
                    startupCursor
                const isSameIndustry =
                    investor.value.industry === value.industry
                const isInvestorAnyIndustry = investor.value.industry === 'any'
                const matchesIndustry = isSameIndustry || isInvestorAnyIndustry
                const isStartupMatched = startupUpdates.has(key)

                if (matchesIndustry && !isStartupMatched) {
                    const matchedStartup: MatchedStartup = {
                        ...value,
                        investorId: investor.key,
                    }
                    startupUpdates.set(key, matchedStartup)
                    startupCount++
                }
            },
            (_: IDBPCursorWithValue) => {
                if (startupCount < MAX_STARTUP_COUNT) {
                    return true
                } else {
                    startupCount = 0
                    return false
                }
            },
        )
    }

    console.log(startupUpdates)
}
