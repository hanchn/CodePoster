<template>
  <div class="code-editor">
    <div 
      ref="editorContainer" 
      class="editor-container"
      :style="{
        width: editorStore.actualEditorWidth,
        height: editorStore.actualEditorHeight
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import * as monaco from 'monaco-editor'
import { useEditorStore } from '@/stores/editor'

const editorStore = useEditorStore()
const editorContainer = ref(null)
let editor = null

// 在 onMounted 中添加
onMounted(() => {
  // 禁用 Monaco Editor 的 worker
  self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
      return 'data:text/javascript;charset=utf-8,' + encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
        };
        importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
      `)
    }
  }

  editor = monaco.editor.create(editorContainer.value, {
    ...editorStore.editorOptions,
    automaticLayout: true,
    scrollBeyondLastLine: false,
    wordWrap: 'on', // 强制启用自动换行，覆盖 store 设置
    minimap: { enabled: false },
    padding: { top: 0, bottom: 0 }
  })

  // 监听编辑器内容变化
  editor.onDidChangeModelContent(() => {
    editorStore.updateCode(editor.getValue())
  })
  
  // 暴露编辑器实例到全局，供录制功能使用
  window.monacoEditorInstance = editor
})

// 在 onUnmounted 中清理
onUnmounted(() => {
  // 清理全局引用
  if (window.monacoEditorInstance) {
    delete window.monacoEditorInstance
  }
})

// 监听编辑器选项变化
watch(
  () => editorStore.editorOptions,
  (newOptions) => {
    if (editor) {
      editor.updateOptions({
        ...newOptions,
        wordWrap: 'on', // 强制保持自动换行
        padding: { top: 20, bottom: 20 }
      })
    }
  },
  { deep: true }
)

// 监听尺寸变化
watch(
  [() => editorStore.actualEditorWidth, () => editorStore.actualEditorHeight],
  () => {
    if (editor) {
      // 延迟调用 layout 以确保 DOM 更新完成
      setTimeout(() => {
        editor.layout()
      }, 100)
    }
  }
)
</script>

<style lang="scss" scoped>
.code-editor {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.editor-container {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  padding: 10px; /* 添加容器内边距 */
}
</style>