import { loadFromCsv } from '../dataAccess/csvLoader'
import {
    initializeDb,
    storeInDb,
    getValueFromDb,
} from '../dataAccess/idbManager'
import { Investor, Startup } from '../types'

const DATABASE_NAME = 'matcher-db'
const INVESTORS_STORE_NAME = 'investors'
const STARTUPS_STORE_NAME = 'startups'
const FLAGS_STORE_NAME = 'flags'
const INVESTORS_CSV_URL = '/data/investors.csv'
const STARTUPS_CSV_URL = '/data/startups.csv'

type LoadedFlag = {
    name: string
    status: 'loaded' | 'deleted'
}

export const initializeApp = async () => {
    await initializeDb(DATABASE_NAME, [
        { name: INVESTORS_STORE_NAME, options: { autoIncrement: true } },
        { name: STARTUPS_STORE_NAME, options: { autoIncrement: true } },
        { name: FLAGS_STORE_NAME, options: { keyPath: 'name' } },
    ])

    await loadCsvToStore<Investor>(
        INVESTORS_CSV_URL,
        DATABASE_NAME,
        INVESTORS_STORE_NAME,
    )

    await loadCsvToStore<Startup>(
        STARTUPS_CSV_URL,
        DATABASE_NAME,
        STARTUPS_STORE_NAME,
    )
}

const setLoadedFlag = async (
    dbName: string,
    storeName: string,
    values: LoadedFlag,
): Promise<boolean> => storeInDb<LoadedFlag>(dbName, storeName, values)

const checkIfLoaded = async (
    dbName: string,
    storeName: string,
    key: string,
): Promise<boolean> => {
    const flag = await getValueFromDb(dbName, storeName, key)
    return Boolean(flag) && flag.status === 'loaded'
}

const loadCsvToStore = async <T>(
    csvUrl: string,
    dbName: string,
    storeName: string,
) => {
    const isCsvAlreadyLoaded = await checkIfLoaded(
        dbName,
        FLAGS_STORE_NAME,
        csvUrl,
    )

    if (!isCsvAlreadyLoaded) {
        const mapRow = (row: string[]): [undefined, T] => [
            undefined,
            { name: row[0], industry: row[1] } as T,
        ]

        const storeData = async (value: T): Promise<void> => {
            await storeInDb<T>(dbName, storeName, value)
        }

        const loadIsSuccessful = await loadFromCsv<T>(csvUrl, mapRow, storeData)

        if (loadIsSuccessful) {
            await setLoadedFlag(dbName, FLAGS_STORE_NAME, {
                name: csvUrl,
                status: 'loaded',
            })
        }
    }
}
