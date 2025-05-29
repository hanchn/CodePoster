<template>
  <div class="control-panel">
    <div class="panel-section">
      <h3>主题设置</h3>
      <div class="control-group">
        <label>主题:</label>
        <button @click="themeStore.toggleTheme()" class="theme-toggle">
          {{ themeStore.currentTheme === 'dark' ? '🌞 浅色' : '🌙 深色' }}
        </button>
      </div>
    </div>

    <div class="panel-section">
      <h3>代码设置</h3>
      <div class="control-group">
        <label>语言:</label>
        <select v-model="editorStore.language" class="language-select">
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="csharp">C#</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
          <option value="swift">Swift</option>
          <option value="kotlin">Kotlin</option>
        </select>
      </div>
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
      <div class="control-group">
        <label>编辑器宽度:</label>
        <input 
          v-model.number="editorStore.editorWidth" 
          type="range" 
          min="600" 
          max="1400" 
          step="50" 
          class="range-input"
        >
        <span>{{ editorStore.editorWidth }}px</span>
      </div>
      <div class="control-group">
        <label>编辑器高度:</label>
        <input 
          v-model.number="editorStore.editorHeight" 
          type="range" 
          min="400" 
          max="1000" 
          step="50" 
          class="range-input"
        >
        <span>{{ editorStore.editorHeight }}px</span>
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
import { useThemeStore } from '@/stores/theme'

const editorStore = useEditorStore()
const themeStore = useThemeStore()

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

.theme-toggle {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--hover-bg);
  }
}

.language-select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-color);
  
  option {
    background-color: var(--input-bg);
    color: var(--text-color);
  }
}

.range-input {
  flex: 1;
  margin: 0 0.5rem;
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
  background-color: var(--input-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: var(--hover-bg);
  }
}
</style>