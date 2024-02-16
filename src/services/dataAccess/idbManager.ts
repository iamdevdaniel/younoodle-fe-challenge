import { openDB } from 'idb'

export const initializeDb = async (
    databaseName: string,
    tableName: string,
    indexName?: string,
): Promise<void> => {
    try {
        await openDB(databaseName, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(tableName)) {
                    const store = db.createObjectStore(tableName)
                    if (indexName) {
                        store.createIndex(indexName, indexName, {
                            unique: true,
                        })
                    }
                }
            },
        })
    } catch (error) {
        console.error('Error initializing database:', error)
    }
}

export const storeInDb = async <T>(
    key: string,
    values: T,
    databaseName: string,
    tableName: string,
): Promise<void> => {
    try {
        const db = await openDB(databaseName, 1)
        const tx = db.transaction(tableName, 'readwrite')
        const store = tx.objectStore(tableName)

        await store.put(values, key)
        await tx.done

        db.close()
    } catch (error) {
        console.error('Error storing data in IndexedDB:', error)
    }
}
