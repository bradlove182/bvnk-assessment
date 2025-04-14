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
    message?: string
    requestId: string
    errorList?: RequestError[]
}

export interface Quote {
    uuid: string
    merchantDisplayName: string
    merchantId: string
    dateCreated: number
    expiryDate: number
    quoteExpiryDate: number
    acceptanceExpiryDate?: number
    quoteStatus: "ACCEPTED" | "PENDING"
    reference: string
    type: string
    subType: string
    status: "EXPIRED" | "PENDING"
    displayCurrency: { currency: string, amount: number, actual: number }
    walletCurrency: { currency: string, amount: number, actual: number }
    paidCurrency: { currency: string, amount: number, actual: number }
    feeCurrency: { currency: string, amount: number, actual: number }
    networkFeeCurrency: { currency: string, amount: number, actual: number }
    displayRate: number
    exchangeRate: number
    address: {
        address: string
        tag: string
        protocol: string
        uri: string
        alternatives: string[]
    }
    returnUrl: string
    redirectUrl: string
    transactions: any[]
    refund: any
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
    const requestInit: RequestInit = {
        headers: {
            "Content-Type": "application/json",
        },
        ...init,
    }

    const response = await fetch(input, requestInit)

    const json = await response.json()

    if (isRequestError(json)) {
        // There can potentially be multiple errors, but we only want the first one for the sake of simplicity
        const error = json.errorList?.[0]
        return {
            data: undefined,
            // We want to include the original error in the response for debugging purposes
            error: error ? { ...error, ...json } : json,
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

export async function payQuote(uuid: string) {
    return fetchRequest<Quote>(`https://api.sandbox.bvnk.com/api/v1/pay/${uuid}/accept/summary`, {
        method: "PUT",
        body: JSON.stringify({
            successUrl: "no_url",
        }),
    })
}
