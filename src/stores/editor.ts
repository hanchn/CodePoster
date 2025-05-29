import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface EditorState {
  code: string
  language: string
  fontSize: number
  lineWrap: boolean
  lineNumbers: boolean
  readOnly: boolean
}

export const useEditorStore = defineStore('editor', () => {
  const code = ref('')
  const language = ref('javascript')
  const fontSize = ref(14)
  const lineWrap = ref(false)
  const lineNumbers = ref(true)
  const readOnly = ref(false)

  const editorOptions = computed(() => ({
    value: code.value,
    language: language.value,
    fontSize: fontSize.value,
    wordWrap: lineWrap.value ? 'on' : 'off',
    lineNumbers: lineNumbers.value ? 'on' : 'off',
    readOnly: readOnly.value,
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false
  }))

  const updateCode = (newCode: string) => {
    code.value = newCode
  }

  const setLanguage = (newLanguage: string) => {
    language.value = newLanguage
  }

  const setFontSize = (size: number) => {
    fontSize.value = size
  }

  const toggleLineWrap = () => {
    lineWrap.value = !lineWrap.value
  }

  const toggleLineNumbers = () => {
    lineNumbers.value = !lineNumbers.value
  }

  return {
    code,
    language,
    fontSize,
    lineWrap,
    lineNumbers,
    readOnly,
    editorOptions,
    updateCode,
    setLanguage,
    setFontSize,
    toggleLineWrap,
    toggleLineNumbers
  }
})