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
    : (token: string) => {
        localStorage.setItem(STORAGE, token)
      }

  return {
    getToken,
    setToken
  }
}

export interface TokenHandler {
  setToken: (token: string) => void
  getToken: () => string | null
}
