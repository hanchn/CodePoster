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
  
  // 状态变量
  let generatedImageUrl = null;
  
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
  
  // 更新代码高亮 - 修复高亮问题
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
  
  // 语言切换事件
  languageSelect.addEventListener("change", function() {
    updateHighlight();
  });
  
  // 字体大小调整
  fontSizeInput.addEventListener("change", function() {
    const fontSize = this.value + "px";
    codeInput.style.fontSize = fontSize;
    codeDisplay.style.fontSize = fontSize;
    lineNumbers.style.fontSize = fontSize;
    
    // 确保行高也相应调整，解决光标位置问题
    const lineHeight = Math.round(parseInt(fontSize) * 1.4) + "px";
    codeInput.style.lineHeight = lineHeight;
    codeDisplay.style.lineHeight = lineHeight;
    lineNumbers.style.lineHeight = lineHeight;
  });
  
  // 自动换行切换
  wrapToggle.addEventListener("change", function() {
    if (this.checked) {
      codeInput.style.whiteSpace = "pre-wrap";
      codeDisplay.style.whiteSpace = "pre-wrap";
      codeDisplay.querySelector("code").style.whiteSpace = "pre-wrap";
    } else {
      codeInput.style.whiteSpace = "pre";
      codeDisplay.style.whiteSpace = "pre";
      codeDisplay.querySelector("code").style.whiteSpace = "pre";
    }
  });
  
  // 复制代码
  copyBtn.addEventListener("click", function() {
    try {
      // 使用现代API进行复制
      navigator.clipboard.writeText(codeInput.value).then(() => {
        // 显示复制成功提示
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "复制成功!";
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 1500);
      }).catch(err => {
        // 如果现代API失败，回退到传统方法
        codeInput.select();
        document.execCommand("copy");
        
        // 显示复制成功提示
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "复制成功!";
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 1500);
      });
    } catch (error) {
      alert("复制失败: " + error.message);
    }
  });
  
  // 处理Tab键
  codeInput.addEventListener("keydown", function(e) {
    if (e.key === "Tab") {
      e.preventDefault();
      
      // 插入制表符（4个空格）
      const start = this.selectionStart;
      const end = this.selectionEnd;
      
      this.value =
        this.value.substring(0, start) +
        "    " +
        this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 4;
      
      updateLineNumbers();
      updateHighlight();
    }
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
      generatedImageUrl,
      recordedChunks: [],
      mediaRecorder: null,
      isRecording: false
    },
    functions: {
      updateLineNumbers,
      updateHighlight,
      escapeHTML
    }
  };
});