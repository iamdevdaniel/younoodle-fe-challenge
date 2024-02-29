import CONSTS from '../constants'
import { loadFromCsv } from '../dataAccess/csvLoader'
import {
    initializeDb,
    storeInDb,
    getValueFromDb,
} from '../dataAccess/idbManager'
import { Investor, Startup, OperationFlag } from '../types'

export const initializeStores = async () => {
    await initializeDb(CONSTS.DATABASE_NAME, [
        { name: CONSTS.INVESTORS_STORE_NAME, options: { autoIncrement: true } },
        { name: CONSTS.STARTUPS_STORE_NAME, options: { autoIncrement: true } },
        { name: CONSTS.FLAGS_STORE_NAME, options: { keyPath: 'name' } },
    ])
}

export const loadCsvFilesToDb = async () => {
    await loadCsvToStore<Investor>(
        CONSTS.INVESTORS_CSV_URL,
        CONSTS.DATABASE_NAME,
        CONSTS.INVESTORS_STORE_NAME,
    )

    await loadCsvToStore<Startup>(
        CONSTS.STARTUPS_CSV_URL,
        CONSTS.DATABASE_NAME,
        CONSTS.STARTUPS_STORE_NAME,
    )
}

const setLoadedFlag = async (
    dbName: string,
    storeName: string,
    value: OperationFlag,
): Promise<boolean> => await storeInDb<OperationFlag>(dbName, storeName, value)

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
        CONSTS.FLAGS_STORE_NAME,
        csvUrl,
    )

    if (!isCsvAlreadyLoaded) {
        const mapRow = (row: string[]): [undefined, T] => [
            undefined,
            { name: row[0].trim(), industry: row[1].trim() } as T,
        ]

        const storeData = async (value: T): Promise<void> => {
            await storeInDb<T>(dbName, storeName, value)
        }

        const loadIsSuccessful = await loadFromCsv<T>(csvUrl, mapRow, storeData)

        if (loadIsSuccessful) {
            await setLoadedFlag(dbName, CONSTS.FLAGS_STORE_NAME, {
                name: csvUrl,
                status: 'loaded',
            })
        }
    }
}
