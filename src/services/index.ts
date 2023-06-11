import initServimav from '@servimav/wings-services'
import { defaultTokenHandler } from '@servimav/wings-services/tokenHandler'

export const useServices = () =>
  initServimav({
    apiUrl: 'http://localhost:8000/api',
    tokenHandler: defaultTokenHandler({}),
    appSecretKey: import.meta.env.VITE_APP_TOKEN
  })
