<template>
  <div class="main-layout">
    <div class="content-area">
      <div class="editor-section">
        <CodeEditor />
      </div>
    </div>
    
    <!-- 浮动工具栏 -->
    <div class="floating-panel" :class="{ 'panel-hidden': !panelVisible }">
      <div class="panel-content">
        <ControlPanel @start-recording="handleStartRecording" />
      </div>
      <button class="panel-toggle" @click="togglePanel">
        {{ panelVisible ? '❯' : '❮' }}
      </button>
    </div>
    
    <!-- 录制控制器 -->
    <RecordingController 
      ref="recordingController"
      @recording-started="onRecordingStarted"
      @recording-stopped="onRecordingStopped"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CodeEditor from '@/components/editor/CodeEditor.vue'
import ControlPanel from '@/components/panels/ControlPanel.vue'
import RecordingController from '@/components/recording/RecordingController.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const panelVisible = ref(true)
const recordingController = ref(null)

const togglePanel = () => {
  panelVisible.value = !panelVisible.value
}

// 处理开始录制
const handleStartRecording = async () => {
  if (recordingController.value) {
    // 录制时自动收起菜单
    panelVisible.value = false
    await recordingController.value.startRecording()
  }
}

// 录制开始回调
const onRecordingStarted = () => {
  console.log('录制已开始')
}

// 录制结束回调
const onRecordingStopped = () => {
  console.log('录制已结束')
  // 录制结束后可以重新显示菜单
  // panelVisible.value = true
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
    transform: translateX(300px); /* 隐藏整个面板宽度 */
  }
}

.panel-content {
  width: 300px;
  height: 100vh;
  background-color: var(--panel-bg);
  border-left: 1px solid var(--border-color);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
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
  position: absolute;
  left: -40px; /* 紧贴面板左边缘 */
  top: 50%;
  transform: translateY(-50%);
  z-index: 1001;
  
  &:hover {
    background-color: var(--hover-bg);
  }
}

/* 当面板隐藏时，按钮保持可见 */
.floating-panel.panel-hidden .panel-toggle {
  left: -40px; /* 保持在相对面板的位置 */
}
</style>