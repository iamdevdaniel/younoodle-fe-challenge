import CONSTS from '../constants'
import { iterateDbWithCursor } from '../dataAccess/idbManager'
import {
    InvestorRecord,
    InvestorWithStartups,
    MatchedStartupRecord,
} from '../types'

export const getMatchedStartupsForInvestors = async () => {
    const ITEMS_PER_SCROLL = 100
    const selectedInvestors: Array<InvestorRecord> = []
    const investorsWithStartups: Array<InvestorWithStartups> = []

    await iterateDbWithCursor(
        CONSTS.DATABASE_NAME,
        CONSTS.INVESTORS_STORE_NAME,
        async cursor => {
            const investorRecord: InvestorRecord = {
                key: cursor.key,
                value: cursor.value,
            }
            selectedInvestors.push(investorRecord)
        },
        _ => selectedInvestors.length < ITEMS_PER_SCROLL,
    )

    for (const investor of selectedInvestors) {
        const startups: Array<MatchedStartupRecord> = []
        let startupCount = 0

        await iterateDbWithCursor(
            CONSTS.DATABASE_NAME,
            CONSTS.STARTUPS_STORE_NAME,
            async cursor => {
                const { key, value }: MatchedStartupRecord = cursor

                if (investor.key === value.investorId) {
                    startups.push({ key, value })
                    startupCount++
                }
            },
            _ => {
                if (startupCount < ITEMS_PER_SCROLL) {
                    return true
                } else {
                    startupCount = 0
                    return false
                }
            },
        )

        investorsWithStartups.push({ investor, startups })
    }

    return investorsWithStartups
}
