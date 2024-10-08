import { defineStore } from 'pinia'
import { computed } from 'vue'
import { getToken, setToken, removeToken } from '@renderer/utils/auth'

export const useUserStore = defineStore('user', () => {
  const login = () => {
    setToken('token')
  }
  const logout = () => {
    removeToken()
  }
  const getTokenVal = computed(() => {
    return getToken()
  })
  return { login, logout, getTokenVal }
})
