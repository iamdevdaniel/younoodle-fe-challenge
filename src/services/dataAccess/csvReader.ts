export const loadFromCsv = async <T>(
    url: string,
    mapRow: (row: string[]) => [string, T],
    storeInDb: (key: string, value: T) => Promise<void>,
): Promise<boolean> => {
    try {
        const response = await fetch(url)
        const data = await response.text()
        const rows = data.split('\n')

        for (const row of rows) {
            const rawRow = row.split(',')
            const [key, values] = mapRow(rawRow)
            await storeInDb(key, values)
        }
        return true
    } catch (error) {
        console.log('Error when reading from csv file: ', error)
        return false
    }
}
