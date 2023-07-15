import axios, { type AxiosRequestHeaders } from 'axios'
import { type TokenHandler, defaultTokenHandler } from './tokenHandler'
import announcement from './services/announcement'
import currency from './services/currency'
import geoLocation from './services/geoLocation'
import shopCategory from './services/shopCategory'
import shopOffer from './services/shopOffer'
import shopOrder from './services/shopOrder'
import shopStore from './services/shopStore'
import user from './services/user'

/**
 * setupWings
 * @param props WingsProps
 */
function setupWings({ apiUrl, tokenHandler, appSecretKey }: WingsProps) {
  const api = axios.create({
    baseURL: apiUrl,
    withCredentials: true
  })

  const { getToken } = tokenHandler

  api.interceptors.request.use((_request) => {
    /* Append content type header if its not present */
    if (!(_request.headers as AxiosRequestHeaders)['Content-Type']) {
      ;(_request.headers as AxiosRequestHeaders)['Content-Type'] = 'application/json'
    }
    /* Append content type header if its not present */
    if (!(_request.headers as AxiosRequestHeaders)['App-Token']) {
      ;(_request.headers as AxiosRequestHeaders)['App-Token'] = appSecretKey
    }
    if (getToken) {
      const token = getToken()
      /* Check if authorization is set */
      if (!(_request.headers as AxiosRequestHeaders)['Authorization']) {
        /* Check if the user is authenticated to send Bearer token */
        if (token && token.length > 0) {
          ;(_request.headers as AxiosRequestHeaders).Authorization = 'Bearer ' + token
        }
      }
    }
    return _request
  })

  return {
    api,
    announcement: announcement(api),
    currency: currency(api),
    geoLocation: geoLocation(api),
    user: user({ api, tokenHandler }),
    shop: {
      category: shopCategory(api),
      offer: shopOffer(api),
      order: shopOrder(api),
      store: shopStore(api)
    }
  }
}

export default setupWings

export { defaultTokenHandler }

export * from './const'
export * from './helpers'
export * from './tokenHandler'
export * from './types'
export * from './services/announcement'
export * from './services/currency'
export * from './services/geoLocation'
export * from './services/shopCategory'
export * from './services/shopOffer'
export * from './services/shopOrder'
export * from './services/shopStore'
export * from './services/user'

interface WingsProps {
  apiUrl: string
  tokenHandler: TokenHandler
  appSecretKey: string
}
