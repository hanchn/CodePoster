<template>
  <div class="recording-controller">
    <!-- 录制中的悬浮按钮 -->
    <div v-if="isRecording" class="recording-float-btn" @click="stopRecording">
      <div class="recording-indicator"></div>
      <span>结束录制</span>
    </div>
    
    <!-- 视频预览模态框 -->
    <div v-if="showPreview" class="video-preview-modal" @click.self="closePreview">
      <div class="preview-content">
        <h3>录制预览</h3>
        <video 
          ref="previewVideo" 
          :src="videoUrl" 
          controls 
          class="preview-video"
        ></video>
        <div class="preview-actions">
          <button @click="downloadVideo" class="download-btn">
            📥 下载视频
          </button>
          <button @click="discardVideo" class="discard-btn">
            🗑️ 废弃视频
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { ScreenRecorder } from '@/utils/screenRecorder'

const emit = defineEmits(['recording-started', 'recording-stopped'])

const isRecording = ref(false)
const showPreview = ref(false)
const videoUrl = ref('')
const videoBlob = ref(null)
const previewVideo = ref(null)

// Use ref for better reactivity and null checking
const screenRecorder = ref(new ScreenRecorder())

// 开始录制
const startRecording = async () => {
  try {
    // 获取编辑器容器元素
    const editorElement = document.querySelector('.editor-container')
    if (!editorElement) {
      throw new Error('未找到编辑器元素')
    }

    await screenRecorder.value.startRecording(editorElement)
    isRecording.value = true
    emit('recording-started')
    console.log('开始录制编辑器区域')
  } catch (error) {
    console.error('开始录制失败:', error)
    alert('录制失败: ' + error.message)
  }
}

// 停止录制
const stopRecording = async () => {
  try {
    const blob = await screenRecorder.value.stopRecording()
    videoBlob.value = blob
    videoUrl.value = URL.createObjectURL(blob)
    
    isRecording.value = false
    showPreview.value = true
    emit('recording-stopped')
    console.log('录制结束，显示预览')
  } catch (error) {
    console.error('停止录制失败:', error)
    alert('停止录制失败: ' + error.message)
    isRecording.value = false
  }
}

// 下载视频
const downloadVideo = () => {
  if (videoBlob.value) {
    const link = document.createElement('a')
    link.href = videoUrl.value
    link.download = `code-recording-${Date.now()}.webm`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    closePreview()
    console.log('视频下载完成')
  }
}

// 废弃视频
const discardVideo = () => {
  closePreview()
  console.log('视频已废弃')
}

// 关闭预览
const closePreview = () => {
  showPreview.value = false
  if (videoUrl.value) {
    URL.revokeObjectURL(videoUrl.value)
    videoUrl.value = ''
  }
  videoBlob.value = null
}

// 清理资源
onUnmounted(() => {
  if (videoUrl.value) {
    URL.revokeObjectURL(videoUrl.value)
  }
  if (screenRecorder.value && typeof screenRecorder.value.cleanup === 'function') {
    screenRecorder.value.cleanup()
  }
})

// 暴露方法给父组件
defineExpose({
  startRecording,
  stopRecording,
  isRecording
})
</script>

<style lang="scss" scoped>
.recording-controller {
  position: relative;
}

.recording-float-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #ff4757, #ff3838);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 15px rgba(255, 71, 87, 0.4);
  transition: all 0.3s ease;
  user-select: none;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 71, 87, 0.6);
  }
  
  &:active {
    transform: translateY(0);
  }
}

.recording-indicator {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

.video-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  backdrop-filter: blur(5px);
}

.preview-content {
  background: var(--panel-bg);
  border-radius: 12px;
  padding: 24px;
  max-width: 80vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  h3 {
    margin: 0;
    color: var(--text-color);
    font-size: 18px;
    text-align: center;
  }
}

.preview-video {
  max-width: 100%;
  max-height: 60vh;
  border-radius: 8px;
  background: #000;
}

.preview-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &.download-btn {
      background: #2ed573;
      color: white;
      
      &:hover {
        background: #26d467;
        transform: translateY(-1px);
      }
    }
    
    &.discard-btn {
      background: #ff4757;
      color: white;
      
      &:hover {
        background: #ff3838;
        transform: translateY(-1px);
      }
    }
  }
}

@media (max-width: 768px) {
  .recording-float-btn {
    bottom: 20px;
    right: 20px;
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .preview-content {
    margin: 20px;
    padding: 20px;
    max-width: calc(100vw - 40px);
    max-height: calc(100vh - 40px);
  }
  
  .preview-video {
    max-height: 50vh;
  }
  
  .preview-actions {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
}
</style>