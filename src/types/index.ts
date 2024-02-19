export type MatchedStatus = 'matched' | 'removed'
export type Industry = 'bio' | 'internet' | 'environment'

export type Investor = {
    name: string
    industry: Industry | 'any'
}

export type InvestorRecord = {
    key: number
    value: Investor
}

export type Startup = {
    name: string
    industry: Industry
}

export type MatchedStartup = Startup & {
    investorId: number
    status: MatchedStatus
}
