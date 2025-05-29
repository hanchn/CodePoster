/**
 * 屏幕录制工具
 * 专门录制编辑器区域
 */
export class ScreenRecorder {
  constructor() {
    this.mediaRecorder = null
    this.recordedChunks = []
    this.isRecording = false
    this.stream = null
  }

  // 开始录制指定元素
  async startRecording(element) {
    try {
      // 获取元素的位置和尺寸
      const rect = element.getBoundingClientRect()
      
      // 请求屏幕录制权限
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: rect.width },
          height: { ideal: rect.height }
        },
        audio: false
      })

      // 创建 MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'video/webm;codecs=vp9'
      })

      this.recordedChunks = []
      
      // 监听数据事件
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data)
        }
      }

      // 开始录制
      this.mediaRecorder.start()
      this.isRecording = true
      
      return true
    } catch (error) {
      console.error('开始录制失败:', error)
      return false
    }
  }

  // 停止录制
  stopRecording() {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this.isRecording) {
        resolve(null)
        return
      }

      this.mediaRecorder.onstop = () => {
        // 创建视频 Blob
        const blob = new Blob(this.recordedChunks, {
          type: 'video/webm'
        })
        
        // 停止所有轨道
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop())
        }
        
        this.isRecording = false
        resolve(blob)
      }

      this.mediaRecorder.stop()
    })
  }

  // 清理资源
  cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop())
      this.stream = null
    }
    if (this.mediaRecorder) {
      this.mediaRecorder = null
    }
    this.recordedChunks = []
    this.isRecording = false
  }

  // 下载录制的视频
  downloadVideo(blob, filename = `code-recording-${Date.now()}.webm`) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}