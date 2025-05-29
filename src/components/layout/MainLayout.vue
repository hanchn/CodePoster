<template>
  <div class="main-layout" :class="themeStore.currentTheme">
    <AppHeader />
    <div class="content-area">
      <CodeEditor />
    </div>
    <ControlPanel />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import ControlPanel from '@/components/panels/ControlPanel.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.content-area {
  flex: 1;
  padding: 20px;
  overflow: hidden;
}
</style>