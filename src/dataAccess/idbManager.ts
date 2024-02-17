import { openDB } from 'idb'

const DB_DEFAULT_VERSION = 1

export const initializeDb = async (
    databaseName: string,
    tableNames: Array<{
        name: string
        index?: string
        keyPath?: string
    }>,
): Promise<void> => {
    try {
        await openDB(databaseName, DB_DEFAULT_VERSION, {
            upgrade(db) {
                for (const tableName of tableNames) {
                    if (!db.objectStoreNames.contains(tableName.name)) {
                        const options: IDBObjectStoreParameters =
                            tableName.keyPath
                                ? { keyPath: tableName.keyPath }
                                : { autoIncrement: true }
                        const store = db.createObjectStore(
                            tableName.name,
                            options,
                        )
                        if (tableName.index) {
                            store.createIndex(
                                tableName.index,
                                tableName.index,
                                { unique: true },
                            )
                        }
                    }
                }
            },
        })
    } catch (error) {
        console.error(`Error initializing database ${databaseName}:`, error)
    }
}

export const storeInDb = async <T>(
    databaseName: string,
    tableName: string,
    values: T,
    key?: string,
): Promise<void> => {
    try {
        const db = await openDB(databaseName, DB_DEFAULT_VERSION)
        const tx = db.transaction(tableName, 'readwrite')
        const store = tx.objectStore(tableName)

        await store.put(values, key)
        await tx.done
        db.close()
    } catch (error) {
        console.error(
            `Error storing data in ${databaseName}/${tableName}:`,
            error,
        )
    }
}

export const getValueFromDb = async (
    key: string,
    tableName: string,
    databaseName: string,
) => {
    try {
        const db = await openDB(databaseName, DB_DEFAULT_VERSION)
        const value = await db.get(tableName, key)

        db.close()
        return value
    } catch (error) {
        console.error(
            `Error getting value from ${databaseName}/${tableName}:`,
            error,
        )
    }
}
