export const csvReader = async (url: string): Promise<Array<[string, string]>> => {

    try {
        const response = await fetch(url)
        const data = await response.text()
        const rows = data.split('\n')
        const contents = rows.map(row => {
            const values = row.split(',')
            return [values[0], values[1]] as [string, string]
        })
        return contents
    }
    catch (error) {
        console.log('Error when reading from csv file: ', error)
        return []
    }
}