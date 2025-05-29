import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref('dark')

  const initTheme = () => {
    const savedTheme = localStorage.getItem('codeposter-theme')
    if (savedTheme) {
      currentTheme.value = savedTheme
    }
    applyTheme()
  }

  const setTheme = (theme) => {
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