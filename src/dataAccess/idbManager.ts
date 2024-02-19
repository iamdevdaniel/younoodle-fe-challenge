import {
    openDB,
    IDBPDatabase,
    IDBPTransaction,
    IDBPObjectStore,
    IDBPCursorWithValue,
} from 'idb'

const DB_DEFAULT_VERSION = 1

export const initializeDb = async (
    databaseName: string,
    storeDefinitions: Array<{
        name: string
        options?: IDBObjectStoreParameters & { index?: string }
    }>,
): Promise<boolean> => {
    try {
        await openDB(databaseName, DB_DEFAULT_VERSION, {
            upgrade(db) {
                for (const definition of storeDefinitions) {
                    if (!db.objectStoreNames.contains(definition.name)) {
                        const store = db.createObjectStore(
                            definition.name,
                            definition.options,
                        )

                        if (definition.options?.index) {
                            store.createIndex(
                                definition.options.index,
                                definition.options.index,
                            )
                        }
                    }
                }
            },
        })
        return true
    } catch (error) {
        console.error(`Error initializing database ${databaseName}:`, error)
        return false
    }
}

export const storeInDb = async <T>(
    databaseName: string,
    definition: string,
    values: T,
    key?: string,
): Promise<boolean> => {
    try {
        const db = await openDB(databaseName, DB_DEFAULT_VERSION)
        const tx = db.transaction(definition, 'readwrite')
        const store = tx.objectStore(definition)

        await store.put(values, key)
        await tx.done
        db.close()
        return true
    } catch (error) {
        console.error(
            `Error storing data in ${databaseName}/${definition}:`,
            error,
        )
        return false
    }
}

export const storeInDbBulk = async <T>(
    databaseName: string,
    storeName: string,
    entries: Map<IDBValidKey, T>,
): Promise<boolean> => {
    try {
        const db = await openDB(databaseName, DB_DEFAULT_VERSION)
        const tx = db.transaction(storeName, 'readwrite')
        const store = tx.objectStore(storeName)

        for (const [key, value] of entries) {
            await store.put(value, key)
        }

        await tx.done
        db.close()
        return true
    } catch (error) {
        console.error(
            `Error storing data in bulk in ${databaseName}/${storeName}:`,
            error,
        )
        return false
    }
}

export const getValueFromDb = async (
    databaseName: string,
    storeName: string,
    key: string,
) => {
    try {
        const db = await openDB(databaseName, DB_DEFAULT_VERSION)
        const value = await db.get(storeName, key)

        db.close()
        return value
    } catch (error) {
        console.error(
            `Error getting value from ${databaseName}/${storeName}:`,
            error,
        )
    }
}

export const iterateDbWithCursor = async (
    databaseName: string,
    storeName: string,
    callback: (cursor: IDBPCursorWithValue) => Promise<void>,
    predicate?: (cursor: IDBPCursorWithValue) => boolean,
) => {
    try {
        const db: IDBPDatabase = await openDB(databaseName, DB_DEFAULT_VERSION)
        const tx: IDBPTransaction = db.transaction([storeName], 'readonly')
        const store: IDBPObjectStore = tx.objectStore(storeName)
        let cursor: IDBPCursorWithValue | null = await store.openCursor()

        while (cursor && (predicate !== undefined ? predicate(cursor) : true)) {
            await callback(cursor)
            cursor = await cursor.continue()
        }

        db.close()
    } catch (error) {
        console.error(
            `Error iterating cursor over ${databaseName}/${storeName}`,
            error,
        )
    }
}
