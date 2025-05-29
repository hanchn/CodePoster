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
      
      // 请求屏幕录制权限 - 提高录制质量
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: Math.max(rect.width, 1920) }, // 最小1920宽度
          height: { ideal: Math.max(rect.height, 1080) }, // 最小1080高度
          frameRate: { ideal: 30 }, // 30fps
          cursor: 'always' // 显示鼠标光标
        },
        audio: false
      })

      // 创建 MediaRecorder - 提高编码质量
      const options = {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000 // 5Mbps 比特率
      }
      
      // 如果不支持 vp9，尝试 vp8
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'video/webm;codecs=vp8'
      }
      
      this.mediaRecorder = new MediaRecorder(this.stream, options)

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