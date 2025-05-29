<template>
  <div class="code-editor">
    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useEditorStore } from '@/stores/editor'
import * as monaco from 'monaco-editor'

// Disable workers to avoid the error
window.MonacoEnvironment = {
  getWorkerUrl: () => {
    return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
      self.MonacoEnvironment = {
        baseUrl: 'https://unpkg.com/monaco-editor@latest/min/'
      };
      importScripts('https://unpkg.com/monaco-editor@latest/min/vs/base/worker/workerMain.js');
    `)}`
  }
}

const editorContainer = ref(null)
const editorStore = useEditorStore()
let editor = null

onMounted(() => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: editorStore.code,
      language: editorStore.language,
      theme: 'vs-dark',
      fontSize: editorStore.fontSize,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      quickSuggestions: false,
      parameterHints: { enabled: false },
      suggestOnTriggerCharacters: false,
      acceptSuggestionOnEnter: 'off',
      tabCompletion: 'off',
      wordBasedSuggestions: false
    })

    editor.onDidChangeModelContent(() => {
      editorStore.updateCode(editor.getValue())
    })
  }
})

watch(() => editorStore.language, (newLanguage) => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel(), newLanguage)
  }
})

watch(() => editorStore.fontSize, (newSize) => {
  if (editor) {
    editor.updateOptions({ fontSize: newSize })
  }
})

onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
})
</script>

<style lang="scss" scoped>
.code-editor {
  width: 1024px;
  height: 768px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--bg-color);
}

.editor-container {
  width: 100%;
  height: 100%;
  flex: 1;
}
</style>