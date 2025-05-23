// 核心功能和初始化
document.addEventListener("DOMContentLoaded", function () {
  // 获取DOM元素
  const codeInput = document.getElementById("code-input");
  const codeDisplay = document.getElementById("code-display");
  const lineNumbers = document.getElementById("line-numbers");
  const languageSelect = document.getElementById("language-select");
  const fontSizeInput = document.getElementById("font-size-input");
  const wrapToggle = document.getElementById("wrap-toggle");
  const formatBtn = document.getElementById("format-btn");
  const copyBtn = document.getElementById("copy-btn");
  const generateImageBtn = document.getElementById("generate-image-btn");
  const recordVideoBtn = document.getElementById("record-video-btn");
  const editorContainer = document.getElementById("editor-container");
  const imageModal = document.getElementById("image-modal");
  const imageContainer = document.getElementById("image-container");
  const downloadBtn = document.getElementById("download-btn");
  const closeModal = document.getElementById("close-modal");
  const videoModal = document.getElementById("video-modal");
  const videoContainer = document.getElementById("video-container");
  const downloadVideoBtn = document.getElementById("download-video-btn");
  const closeVideoModal = document.getElementById("close-video-modal");
  const recordingIndicator = document.getElementById("recording-indicator");
  
  // 更新行号
  function updateLineNumbers() {
    const content = codeInput.value;
    const lines = content.split("\n");
    const lineCount = lines.length;
    
    let lineNumbersHTML = "";
    for (let i = 1; i <= lineCount; i++) {
      lineNumbersHTML += `<div>${i}</div>`;
    }
    
    lineNumbers.innerHTML = lineNumbersHTML;
  }
  
  // 更新代码高亮
  function updateHighlight() {
    const code = codeInput.value;
    const language = languageSelect.value;
    
    // 使用pre和code标签包裹，确保highlight.js能正确识别
    codeDisplay.innerHTML = `<pre><code class="language-${language}">${escapeHTML(code)}</code></pre>`;
    
    // 应用高亮
    document.querySelectorAll("pre code").forEach((block) => {
      hljs.highlightElement(block);
    });
  }
  
  // HTML转义函数，防止XSS并确保代码正确显示
  function escapeHTML(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
  
  // 代码输入事件
  codeInput.addEventListener("input", function() {
    updateLineNumbers();
    updateHighlight();
  });
  
  // 初始化
  updateLineNumbers();
  updateHighlight();
  
  // 导出全局变量，供其他模块使用
  window.CodePoster = {
    elements: {
      codeInput,
      codeDisplay,
      lineNumbers,
      languageSelect,
      fontSizeInput,
      wrapToggle,
      formatBtn,
      copyBtn,
      generateImageBtn,
      recordVideoBtn,
      editorContainer,
      imageModal,
      imageContainer,
      downloadBtn,
      closeModal,
      videoModal,
      videoContainer,
      downloadVideoBtn,
      closeVideoModal,
      recordingIndicator
    },
    state: {
      generatedImageUrl: null,
      recordedChunks: [],
      mediaRecorder: null,
      isRecording: false,
      typingSpeed: { value: 50 },
      editorHeight: { value: 0 }
    },
    functions: {
      updateLineNumbers,
      updateHighlight,
      escapeHTML
    }
  };
});