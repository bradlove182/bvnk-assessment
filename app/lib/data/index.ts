export interface Success<T> {
    data: T
    error: undefined
}

export interface Failure {
    data: undefined
    error: RequestError
}

export type RequestResponse<T> = Success<T> | Failure

export interface RequestError {
    code: string
    status: string
    message: string
    requestId: string
}

export interface Quote {
    uuid: string
    merchantDisplayName: string
    merchantId: string
    dateCreated: number
    expiryDate: number
    quoteExpiryDate: number | null
    acceptanceExpiryDate: number | null
    quoteStatus: string
    reference: string
    type: string
    subType: string
    status: string
    displayCurrency: { currency: string, amount: number, actual: number }
    walletCurrency: { currency: string, amount: number, actual: number }
    paidCurrency: { currency: string | null, amount: number, actual: number }
    feeCurrency: { currency: string, amount: number, actual: number }
    networkFeeCurrency: { currency: string | null, amount: number, actual: number }
    displayRate: number | null
    exchangeRate: number | null
    address: string | null
    returnUrl: string
    redirectUrl: string
    transactions: any[]
    refund: any | null
    refunds: any[]
    currencyOptions: any[]
    flow: string
    twoStep: boolean
    customerId: string
    networkFeeBilledTo: string
    networkFeeRates: any[]
}

export function isRequestError(error: unknown): error is RequestError {
    return typeof error === "object" && error !== null && "requestId" in error
}

export async function fetchRequest<T>(input: RequestInfo | URL, init?: RequestInit): Promise<RequestResponse<T>> {
    const response = await fetch(input, init)

    const json = await response.json()

    if (isRequestError(json)) {
        return {
            data: undefined,
            error: json,
        }
    }

    return {
        data: json,
        error: undefined,
    }
}

export async function getQuote(uuid: string) {
    return fetchRequest<Quote>(`https://api.sandbox.bvnk.com/api/v1/pay/${uuid}/summary`, {
        method: "GET",
    })
}

export async function updateQuote(args: { uuid: string, currency: string, payInMethod: "crypto" }) {
    const { uuid, ...rest } = args

    return fetchRequest<Quote>(`https://api.sandbox.bvnk.com/api/v1/pay/${uuid}/update/summary`, {
        method: "PUT",
        body: JSON.stringify({ ...rest }),
    })
}
