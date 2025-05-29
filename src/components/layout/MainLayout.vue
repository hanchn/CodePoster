<template>
  <div class="main-layout">
    <div class="content-area">
      <div class="editor-section">
        <CodeEditor />
      </div>
    </div>
    
    <!-- 浮动工具栏 -->
    <div class="floating-panel" :class="{ 'panel-hidden': !panelVisible }">
      <button class="panel-toggle" @click="togglePanel">
        {{ panelVisible ? '❯' : '❮' }}
      </button>
      <div class="panel-content" v-show="panelVisible">
        <ControlPanel />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import ControlPanel from '@/components/panels/ControlPanel.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const panelVisible = ref(true)

const togglePanel = () => {
  panelVisible.value = !panelVisible.value
}
</script>

<style lang="scss" scoped>
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;
  position: relative;
}

.content-area {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.editor-section {
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  z-index: 1000;
  display: flex;
  transition: transform 0.3s ease;
  
  &.panel-hidden {
    transform: translateX(280px);
  }
}

.panel-toggle {
  width: 40px;
  height: 60px;
  background-color: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-right: none;
  border-radius: 8px 0 0 8px;
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.3s ease;
  margin-top: 50vh;
  transform: translateY(-50%);
  
  &:hover {
    background-color: var(--hover-bg);
  }
}

.panel-content {
  width: 300px;
  height: 100vh;
  background-color: var(--panel-bg);
  border-left: 1px solid var(--border-color);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}
</style>