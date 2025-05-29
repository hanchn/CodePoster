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

let screenRecorder = new ScreenRecorder()

// 开始录制