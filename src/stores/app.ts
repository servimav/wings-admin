import { ref } from 'vue'
import { defineStore } from 'pinia'

const STORE_NAME = 'application'

export const useAppStore = defineStore(STORE_NAME, () => {
  const notifications = ref<Notification[]>([])

  /**
   * -----------------------------------------
   *	Methods
   * -----------------------------------------
   */

  /**
   * axiosError
   * @param axiosError
   * @param content
   */
  function axiosError(axiosError: unknown, content = 'Ha ocurrido un error') {
    console.log({ axiosError })
    error(content)
  }

  /**
   * error
   * @param message
   */
  function error(message: string) {
    notify({ message, type: 'negative' })
  }

  /**
   * notify
   * @param notification
   */
  function notify(notification: Notification) {
    notifications.value.push(notification)
    setTimeout(() => {
      notifications.value.pop()
    }, 4000)
  }

  /**
   * success
   * @param message
   */
  function success(message: string) {
    notify({ message, type: 'positive' })
  }

  return {
    notifications,
    // Methods
    axiosError,
    error,
    notify,
    success
  }
})

export interface Notification {
  message: string
  type: 'positive' | 'negative' | 'warning'
}
