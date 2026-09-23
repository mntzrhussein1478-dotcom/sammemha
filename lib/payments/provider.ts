export interface CheckoutRequest{productId:string;quantity?:number;successUrl:string;cancelUrl:string}
export interface CheckoutResult{redirectUrl:string}
export interface PaymentProvider{createCheckout(request:CheckoutRequest):Promise<CheckoutResult>}
// No provider is configured in v1. Keep payment UI hidden until a real provider and server-side verification are implemented.
