import initServimav, { defaultTokenHandler } from '@servimav/wings-services'

export const useServices = () =>
  initServimav({
    apiUrl: 'http://localhost:8000/api',
    tokenHandler: defaultTokenHandler({}),
    appSecretKey: import.meta.env.VITE_APP_TOKEN
  })
