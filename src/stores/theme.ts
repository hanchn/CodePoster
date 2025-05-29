import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ThemeType = 'dark' | 'light'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<ThemeType>('dark')

  const initTheme = () => {
    const savedTheme = localStorage.getItem('codeposter-theme') as ThemeType
    if (savedTheme) {
      currentTheme.value = savedTheme
    }
    applyTheme()
  }

  const setTheme = (theme: ThemeType) => {
    currentTheme.value = theme
    localStorage.setItem('codeposter-theme', theme)
    applyTheme()
  }

  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', currentTheme.value)
  }

  return {
    currentTheme,
    initTheme,
    setTheme,
    toggleTheme
  }
})