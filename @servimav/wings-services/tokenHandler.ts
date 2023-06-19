/**
 * defaultTokenHandler
 * @param params
 * @returns
 */
export function defaultTokenHandler(params: Partial<TokenHandler>): TokenHandler {
  const STORAGE = '@servimav/wings-service/auth_token'

  const getToken = params.getToken
    ? params.getToken
    : () => {
        return localStorage.getItem(STORAGE)
      }

  const setToken = params.setToken
    ? params.setToken
    : (token: string | null) => {
        if (token) localStorage.setItem(STORAGE, token)
        else localStorage.removeItem(STORAGE)
      }

  return {
    getToken,
    setToken
  }
}

export interface TokenHandler {
  setToken: (token: string | null) => void
  getToken: () => string | null
}
