<template>
  <div class="code-editor">
    <div class="editor-toolbar">
      <button @click="formatCode" class="format-btn" :disabled="!canFormat">
        🎨 格式化代码
      </button>
      <button @click="toggleWrap" class="wrap-btn">
        {{ editorStore.lineWrap ? '📄 取消换行' : '📄 自动换行' }}
      </button>
    </div>
    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
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

// 检查当前语言是否支持格式化
const canFormat = computed(() => {
  const supportedLanguages = ['javascript', 'typescript', 'json', 'html', 'css', 'scss', 'less']
  return supportedLanguages.includes(editorStore.language)
})

onMounted(() => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: editorStore.code,
      language: editorStore.language,
      theme: 'vs-dark',
      fontSize: editorStore.fontSize,
      automaticLayout: true,
      wordWrap: editorStore.lineWrap ? 'on' : 'off',
      lineNumbers: 'on',
      lineNumbersMinChars: 4,
      glyphMargin: false,
      folding: true,
      lineDecorationsWidth: 10,
      lineHeight: 22,
      renderLineHighlight: 'line',
      selectOnLineNumbers: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      scrollbar: {
        vertical: 'visible',
        horizontal: 'visible',
        useShadows: false,
        verticalHasArrows: false,
        horizontalHasArrows: false,
        verticalScrollbarSize: 14,
        horizontalScrollbarSize: 14
      },
      overviewRulerBorder: false,
      overviewRulerLanes: 0,
      hideCursorInOverviewRuler: true,
      quickSuggestions: true,
      parameterHints: { enabled: true },
      suggestOnTriggerCharacters: true,
      acceptSuggestionOnEnter: 'on',
      tabCompletion: 'on',
      wordBasedSuggestions: true,
      formatOnPaste: true,
      formatOnType: true
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

watch(() => editorStore.lineWrap, (newWrap) => {
  if (editor) {
    editor.updateOptions({ wordWrap: newWrap ? 'on' : 'off' })
  }
})

// 格式化代码
const formatCode = async () => {
  if (editor && canFormat.value) {
    try {
      await editor.getAction('editor.action.formatDocument').run()
    } catch (error) {
      console.warn('格式化失败:', error)
    }
  }
}

// 切换自动换行
const toggleWrap = () => {
  editorStore.toggleLineWrap()
}

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

.editor-toolbar {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background-color: var(--panel-bg);
  border-bottom: 1px solid var(--border-color);
  flex-shrink: 0;
}

.format-btn,
.wrap-btn {
  padding: 4px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--button-bg);
  color: var(--text-color);
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: var(--button-hover-bg);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.editor-container {
  width: 100%;
  height: 100%;
  flex: 1;
  min-height: 0;
  
  // 确保Monaco Editor正确显示
  :deep(.monaco-editor) {
    .margin {
      background-color: var(--panel-bg) !important;
    }
    
    .monaco-editor-background {
      background-color: var(--bg-color) !important;
    }
    
    .current-line {
      background-color: var(--hover-bg) !important;
    }
  }
}
</style>