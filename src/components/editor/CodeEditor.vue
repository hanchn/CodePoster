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
    wordWrap: 'on', // 启用自动换行
    minimap: { enabled: false },
    padding: { top: 0, bottom: 0 } // 添加编辑器内部上下内边距
  })

  // 监听编辑器内容变化
  editor.onDidChangeModelContent(() => {
    editorStore.updateCode(editor.getValue())
  })
})

// 监听编辑器选项变化
watch(
  () => editorStore.editorOptions,
  (newOptions) => {
    if (editor) {
      editor.updateOptions({
        ...newOptions,
        padding: { top: 20, bottom: 20 } // 确保内边距始终存在
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
  padding: 20px; /* 添加容器内边距 */
}
</style>