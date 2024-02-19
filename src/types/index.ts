export type MatchedStatus = 'matched' | 'removed'
export type Industry = 'bio' | 'internet' | 'environment'

export type Investor = {
    name: string
    industry: Industry | 'any'
}

export type InvestorRecord = {
    key: IDBValidKey
    value: Investor
}

export type Startup = {
    name: string
    industry: Industry
}

export type StartupRecord = {
    key: IDBValidKey
    value: Startup
}

export type MatchedStartup = Startup & {
    investorId: IDBValidKey
    status: MatchedStatus
}

export type MatchedStartupRecord = {
    key: IDBValidKey
    value: MatchedStartup
}

export type OperationFlag = {
    name: string
    status: 'loaded' | 'done'
}
