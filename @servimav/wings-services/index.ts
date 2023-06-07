import axios, { AxiosRequestHeaders } from 'axios';
import type { TokenHandler } from './tokenHandler'
import shopOffer, { ShopCategory, ShopOffer, ShopOfferCreate } from './services/shopOffer'
import shopStore, { ShopStore, ShopStoreCreate } from './services/shopStore'
import user, { User, UserAuthResponse, UserLogin, UserRegister, UserRole } from './services/user'

/**
 * setupWings
 * @param props WingsProps
 */
function setupWings({ apiUrl, tokenHandler }: WingsProps) {

    const api = axios.create({
        baseURL: apiUrl,
        withCredentials: true
    })

    const { getToken } = tokenHandler

    api.interceptors.request.use((_request) => {

        /* Append content type header if its not present */
        if (!(_request.headers as AxiosRequestHeaders)['Content-Type']) {
            (_request.headers as AxiosRequestHeaders)['Content-Type'] =
                'application/json';
        }
        if (getToken) {
            const token = getToken();
            /* Check if authorization is set */
            if (!(_request.headers as AxiosRequestHeaders)['Authorization']) {
                /* Check if the user is authenticated to send Bearer token */
                if (token && token.length > 0) {
                    (_request.headers as AxiosRequestHeaders).Authorization =
                        'Bearer ' + token;
                }
            }
        }
        return _request;
    })

    return {
        api,
        user: user({ api, tokenHandler }),
        shop: {
            offer: shopOffer(api),
            store: shopStore(api)
        }
    }
}

export default setupWings

export type {
    // Shop Offer
    ShopCategory,
    ShopOffer,
    ShopOfferCreate,
    // Shop Store
    ShopStore,
    ShopStoreCreate,
    // Token
    TokenHandler,
    // User
    User,
    UserAuthResponse,
    UserLogin,
    UserRegister,
    UserRole
}


interface WingsProps {
    apiUrl: string
    tokenHandler: TokenHandler
}
