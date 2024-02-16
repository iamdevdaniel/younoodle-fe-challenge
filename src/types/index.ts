export type Industry = 'bio' | 'internet' | 'environment'

export type Investor = {
    name: string
    industry: Industry | 'any'
}

export type Startup = {
    name: string
    industry: Industry
}
