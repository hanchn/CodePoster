<template>
  <div class="control-panel">
    <div class="panel-section">
      <h3>编辑器设置</h3>
      <div class="control-group">
        <label>字体大小:</label>
        <input 
          v-model.number="editorStore.fontSize" 
          type="range" 
          min="12" 
          max="24" 
          class="range-input"
        >
        <span>{{ editorStore.fontSize }}px</span>
      </div>
    </div>
    
    <div class="panel-section">
      <h3>导出功能</h3>
      <div class="button-group">
        <button @click="generateImage" class="action-btn">
          📷 生成图片
        </button>
        <button @click="startRecording" class="action-btn">
          🎥 录制视频
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()

const generateImage = () => {
  // TODO: 实现图片生成功能
  console.log('生成图片功能待实现')
}

const startRecording = () => {
  // TODO: 实现视频录制功能
  console.log('视频录制功能待实现')
}
</script>

<style lang="scss" scoped>
.control-panel {
  width: 300px;
  padding: 1rem;
  background-color: var(--panel-bg);
  border-left: 1px solid var(--border-color);
  overflow-y: auto;
}

.panel-section {
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
  }
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  label {
    min-width: 80px;
    font-size: 0.9rem;
  }
}

.range-input {
  flex: 1;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--button-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--button-hover-bg);
  }
}
</style>