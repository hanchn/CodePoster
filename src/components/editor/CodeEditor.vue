<template>
  <div class="code-editor">
    <div class="editor-toolbar">
      <select v-model="editorStore.language" class="language-select">
        <option value="javascript">JavaScript</option>
        <option value="typescript">TypeScript</option>
        <option value="html">HTML</option>
        <option value="css">CSS</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
      </select>
    </div>
    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useEditorStore } from '@/stores/editor'
import * as monaco from 'monaco-editor'

const editorContainer = ref(null)
const editorStore = useEditorStore()
let editor = null

onMounted(() => {
  editor = monaco.editor.create(editorContainer.value, {
    value: editorStore.code,
    language: editorStore.language,
    theme: 'vs-dark',
    fontSize: editorStore.fontSize,
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false
  })

  editor.onDidChangeModelContent(() => {
    editorStore.updateCode(editor.getValue())
  })
})

watch(() => editorStore.language, (newLanguage) => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel(), newLanguage)
  }
})
</script>

<style lang="scss" scoped>
.code-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  padding: 0.5rem;
  background-color: var(--toolbar-bg);
  border-bottom: 1px solid var(--border-color);
}

.language-select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--input-bg);
  color: var(--text-color);
}

.editor-container {
  flex: 1;
  min-height: 400px;
}
</style>