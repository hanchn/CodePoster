import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useEditorStore = defineStore('editor', () => {
  const code = ref('// 欢迎使用 CodePoster\nconsole.log("Hello, World!");')
  const language = ref('javascript')
  const fontSize = ref(14)
  const lineWrap = ref(true)
  const lineNumbers = ref(true)
  const readOnly = ref(false)
  
  // 编辑器尺寸
  const editorWidth = ref(800)
  const editorHeight = ref(400)
  
  // 代码输出速度设置（毫秒延迟，数值越小速度越快）
  const typingSpeed = ref(120) // 默认120毫秒，对应速度级别5

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

  // 计算实际编辑器尺寸（支持全0全屏）
  const actualEditorWidth = computed(() => {
    return editorWidth.value === 0 ? '100vw' : `${editorWidth.value}px`
  })

  const actualEditorHeight = computed(() => {
    return editorHeight.value === 0 ? '100vh' : `${editorHeight.value}px`
  })

  const updateCode = (newCode) => {
    code.value = newCode
  }

  const setLanguage = (newLanguage) => {
    language.value = newLanguage
  }

  const setFontSize = (size) => {
    fontSize.value = size
  }

  const setEditorSize = (width, height) => {
    editorWidth.value = width
    editorHeight.value = height
  }

  const setTypingSpeed = (speed) => {
    typingSpeed.value = speed
  }

  const toggleLineWrap = () => {
    lineWrap.value = !lineWrap.value
  }

  const toggleLineNumbers = () => {
    lineNumbers.value = !lineNumbers.value
  }

  const toggleReadOnly = () => {
    readOnly.value = !readOnly.value
  }

  return {
    code,
    language,
    fontSize,
    lineWrap,
    lineNumbers,
    readOnly,
    editorWidth,
    editorHeight,
    typingSpeed, // 新增
    actualEditorWidth,
    actualEditorHeight,
    editorOptions,
    updateCode,
    setLanguage,
    setFontSize,
    setEditorSize,
    setTypingSpeed, // 新增
    toggleLineWrap,
    toggleLineNumbers,
    toggleReadOnly
  }
})