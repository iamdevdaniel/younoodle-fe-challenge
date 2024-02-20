import CONSTS from '../constants'
import { iterateDbWithCursor } from '../dataAccess/idbManager'
import {
    InvestorRecord,
    InvestorWithStartups,
    MatchedStartupRecord,
} from '../types'

export const getMatchedStartupsForInvestors = async (
    startId: number,
    limit: number,
) => {
    const selectedInvestors: Array<InvestorRecord> = []
    const investorsWithStartups: Array<InvestorWithStartups> = []
    let startFound = false

    await iterateDbWithCursor(
        CONSTS.DATABASE_NAME,
        CONSTS.INVESTORS_STORE_NAME,
        async cursor => {
            if ((cursor.key as number) === startId) {
                startFound = true
            }
            if (startFound) {
                const investorRecord: InvestorRecord = {
                    key: cursor.key,
                    value: cursor.value,
                }
                selectedInvestors.push(investorRecord)
            }
        },
        _ => selectedInvestors.length < limit,
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
                if (startupCount < limit) {
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
