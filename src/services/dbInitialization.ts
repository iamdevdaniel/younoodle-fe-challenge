import { loadFromCsv } from '../dataAccess/csvLoader'
import { initializeDb, storeInDb } from '../dataAccess/idbManager'
import { Investor, Startup } from '../types'

export const initializeApp = async () => {
    await initializeDb('matcher', [
        { name: 'investors' },
        { name: 'startups' },
        { name: 'flags', keyPath: 'name' },
    ])
    await loadInvestors()
    await loadStartups()
}

const loadInvestors = async () => {
    const mapInvestorRow = (row: string[]): [undefined, Investor] => [
        undefined,
        { name: row[0], industry: row[1] } as Investor,
    ]
    const storeInvestorData = async (value: Investor): Promise<void> => {
        await storeInDb<Investor>('matcher', 'investors', value)
    }
    await loadFromCsv<Investor>(
        '/data/investors.csv',
        mapInvestorRow,
        storeInvestorData,
    )
}

const loadStartups = async () => {
    const mapStartupRow = (row: string[]): [undefined, Startup] => [
        undefined,
        { name: row[0], industry: row[1] } as Startup,
    ]
    const storeStartupData = async (value: Startup): Promise<void> => {
        await storeInDb<Startup>('matcher', 'startups', value)
    }
    await loadFromCsv<Startup>(
        '/data/startups.csv',
        mapStartupRow,
        storeStartupData,
    )
}
