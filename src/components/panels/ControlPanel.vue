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
        <label>输出速度:</label>
        <input 
          v-model.number="speedLevel" 
          type="number" 
          min="1" 
          max="10" 
          step="1"
          class="number-input"
          @input="updateTypingSpeed"
        >
        <span>级别 {{ speedLevel }} ({{ actualSpeed }}ms)</span>
      </div>
      <div class="control-group">
        <label>编辑器宽度:</label>
        <input 
          v-model.number="editorStore.editorWidth" 
          type="number" 
          min="0" 
          max="2000" 
          placeholder="800"
          class="number-input"
        >
        <span class="unit">px (0=全屏)</span>
      </div>
      <div class="control-group">
        <label>编辑器高度:</label>
        <input 
          v-model.number="editorStore.editorHeight" 
          type="number" 
          min="0" 
          max="1200" 
          placeholder="400"
          class="number-input"
        >
        <span class="unit">px (0=全屏)</span>
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
import html2canvas from 'html2canvas'

const editorStore = useEditorStore()
const themeStore = useThemeStore()

// 定义事件
const emit = defineEmits(['start-recording'])

const generateImage = async () => {
  try {
    // 查找编辑器容器元素
    const editorElement = document.querySelector('.editor-container')
    if (!editorElement) {
      alert('未找到编辑器元素')
      return
    }

    // 生成截图
    const canvas = await html2canvas(editorElement, {
      backgroundColor: null, // 保持透明背景
      scale: 2, // 提高图片质量
      useCORS: true,
      allowTaint: true,
      logging: false
    })

    // 创建下载链接
    const link = document.createElement('a')
    link.download = `code-screenshot-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    
    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    console.log('图片生成成功')
  } catch (error) {
    console.error('生成图片失败:', error)
    alert('生成图片失败，请重试')
  }
}

const startRecording = () => {
  // 触发录制事件
  emit('start-recording')
}

// 在 script setup 中添加
import { ref, computed } from 'vue'

// 速度级别 (1-10，数字越大速度越快)
const speedLevel = ref(5) // 默认级别5

// 将速度级别转换为毫秒延迟 (级别越高，延迟越短)
const actualSpeed = computed(() => {
  // 级别1=200ms, 级别10=20ms
  return Math.max(20, 220 - speedLevel.value * 20)
})

// 更新打字速度
const updateTypingSpeed = () => {
  editorStore.setTypingSpeed(actualSpeed.value)
}

// 初始化时设置默认速度
updateTypingSpeed()
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

.number-input {
  width: 80px;
  padding: 0.4rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-color);
  text-align: center;
  
  &:focus {
    outline: none;
    border-color: var(--primary-color);
  }
}

.unit {
  font-size: 0.8rem;
  color: var(--text-secondary);
  min-width: 80px;
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