export const readFromCsv = async <T>(
    url: string,
    map: (values: string[]) => T,
): Promise<Array<T>> => {
    try {
        const response = await fetch(url)
        const data = await response.text()
        const rows = data.split('\n')
        const contents = rows.map(row => {
            const values = row.split(',')
            return map(values)
        })
        return contents
    } catch (error) {
        console.log('Error when reading from csv file: ', error)
        return []
    }
}
