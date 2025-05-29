<template>
  <div class="settings-drawer" :class="{ 'drawer-open': isOpen }">
    <!-- 抽屉触发按钮 -->
    <button @click="toggleDrawer" class="drawer-toggle" :class="{ 'toggle-open': isOpen }">
      <span class="toggle-icon">⚙️</span>
    </button>
    
    <!-- 抽屉内容 -->
    <div class="drawer-content" v-show="isOpen">
      <div class="drawer-header">
        <h3>设置</h3>
        <button @click="closeDrawer" class="close-btn">×</button>
      </div>
      
      <div class="drawer-body">
        <!-- 主题切换 -->
        <div class="panel-section">
          <h4>主题</h4>
          <div class="control-group">
            <button @click="themeStore.toggleTheme()" class="theme-toggle">
              {{ themeStore.currentTheme === 'dark' ? '🌞 亮色' : '🌙 暗色' }}
            </button>
          </div>
        </div>
        
        <!-- 代码语言 -->
        <div class="panel-section">
          <h4>代码语言</h4>
          <div class="control-group">
            <select v-model="editorStore.language" class="language-select">
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
            </select>
          </div>
        </div>
        
        <!-- 字体大小 -->
        <div class="panel-section">
          <h4>字体大小</h4>
          <div class="control-group">
            <input 
              v-model.number="editorStore.fontSize" 
              type="range" 
              min="12" 
              max="24" 
              class="range-input"
            >
            <span class="font-size-label">{{ editorStore.fontSize }}px</span>
          </div>
        </div>
        
        <!-- 导出功能 -->
        <div class="panel-section">
          <h4>导出功能</h4>
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
    </div>
    
    <!-- 遮罩层 -->
    <div v-if="isOpen" @click="closeDrawer" class="drawer-overlay"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useEditorStore } from '@/stores/editor'
import html2canvas from 'html2canvas'

const themeStore = useThemeStore()
const editorStore = useEditorStore()
const isOpen = ref(false)

const toggleDrawer = () => {
  isOpen.value = !isOpen.value
}

const closeDrawer = () => {
  isOpen.value = false
}

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
  console.log('视频录制功能待实现')
}
</script>

<style lang="scss" scoped>
.settings-drawer {
  position: fixed;
  top: 0;
  right: 0;
  height: 100vh;
  z-index: 1000;
}

.drawer-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  background-color: var(--panel-bg);
  color: var(--text-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &:hover {
    background-color: var(--hover-bg);
    transform: scale(1.05);
  }
  
  &.toggle-open {
    right: 320px;
  }
}

.toggle-icon {
  transition: transform 0.3s ease;
}

.toggle-open .toggle-icon {
  transform: rotate(180deg);
}

.drawer-content {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: var(--panel-bg);
  border-left: 1px solid var(--border-color);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.2);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
}

.drawer-open .drawer-content {
  transform: translateX(0);
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: -1;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  
  h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 600;
  }
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background-color: var(--hover-bg);
  }
}

.drawer-body {
  padding: 1rem;
}

.panel-section {
  margin-bottom: 1.5rem;
  
  h4 {
    margin: 0 0 0.75rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-color);
  }
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.theme-toggle {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--button-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    background-color: var(--button-hover-bg);
  }
}

.language-select {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-color);
  font-size: 0.9rem;
}

.range-input {
  flex: 1;
  margin-right: 0.5rem;
}

.font-size-label {
  min-width: 40px;
  font-size: 0.9rem;
  color: var(--text-color);
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--button-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  
  &:hover {
    background-color: var(--button-hover-bg);
  }
}
</style>