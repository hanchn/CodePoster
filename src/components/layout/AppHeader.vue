<template>
  <header class="app-header">
    <div class="header-left">
      <h1 class="app-title">CodePoster</h1>
    </div>
    <div class="header-right">
      <button @click="themeStore.toggleTheme()" class="theme-toggle">
        {{ themeStore.currentTheme === 'dark' ? '🌞' : '🌙' }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
}

.app-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: var(--hover-bg);
  }
}
</style>