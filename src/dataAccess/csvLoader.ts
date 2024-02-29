export const loadFromCsv = async <T>(
    url: string,
    mapRow: (row: string[]) => [string | undefined, T],
    storeData: (value: T, key?: string) => Promise<void>,
): Promise<boolean> => {
    try {
        const response = await fetch(url)
        const data = await response.text()
        const rows = data.split('\n')

        for (const row of rows) {
            const rawRow = row.split(',')
            const [key, values] = mapRow(rawRow)
            await storeData(values, key)
        }
        return true
    } catch (error) {
        console.error('Error when reading from csv file: ', error)
        return false
    }
}
