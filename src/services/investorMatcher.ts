import { IDBPCursorWithValue } from 'idb'

import CONSTS from '../constants'
import {
    getValueFromDb,
    iterateDbWithCursor,
    storeInDbBulk,
    storeInDb,
} from '../dataAccess/idbManager'
import {
    InvestorRecord,
    MatchedStartup,
    StartupRecord,
    OperationFlag,
} from '../types'

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
    investor: InvestorRecord,
    matchedStartups: Map<IDBValidKey, MatchedStartup>,
) => {
    let startupCount = 0

    await iterateDbWithCursor(
        'matcher-db',
        'startups',
        async (startupCursor: IDBPCursorWithValue) => {
            if (startupCount >= CONSTS.MAX_STARTUP_COUNT) {
                return
            }

            const { key, value }: StartupRecord = startupCursor
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

const checkIfMatchedAlready = async (
    dbName: string,
    storeName: string,
    key: string,
): Promise<boolean> => {
    const flag = await getValueFromDb(dbName, storeName, key)
    return Boolean(flag) && flag.status === 'done'
}

const setMatchedFlag = async (
    dbName: string,
    storeName: string,
    value: OperationFlag,
): Promise<boolean> => await storeInDb<OperationFlag>(dbName, storeName, value)

const classifyAndMatchStartupsWithInvestors = async () => {
    const matchedStartups: Map<IDBValidKey, MatchedStartup> = new Map()
    const [specificIndustryInvestors, anyIndustryInvestors] =
        await classifyInvestors()
    const allInvestors = [...specificIndustryInvestors, ...anyIndustryInvestors]

    for (const investor of allInvestors) {
        await matchStartups(investor, matchedStartups)
    }

    const isSuccessful = await storeInDbBulk(
        CONSTS.DATABASE_NAME,
        CONSTS.STARTUPS_STORE_NAME,
        matchedStartups,
    )
    if (isSuccessful) {
        await setMatchedFlag(CONSTS.DATABASE_NAME, CONSTS.FLAGS_STORE_NAME, {
            name: 'matchStartupsWithInvestors',
            status: 'done',
        })
    }
}

export const matchStartupsWithInvestors = async () => {
    const alreadyMatched = await checkIfMatchedAlready(
        CONSTS.DATABASE_NAME,
        CONSTS.FLAGS_STORE_NAME,
        'matchStartupsWithInvestors',
    )

    if (!alreadyMatched) {
        classifyAndMatchStartupsWithInvestors()
    }
}
