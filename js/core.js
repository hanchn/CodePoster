// 核心功能和初始化
document.addEventListener("DOMContentLoaded", function () {
  // 导出全局变量，供其他模块使用
  window.CodePoster = {
    elements: {
      codeInput: document.getElementById("code-input"),
      codeDisplay: document.getElementById("code-display"),
      lineNumbers: document.getElementById("line-numbers"),
      languageSelect: document.getElementById("language-select"),
      fontSizeInput: document.getElementById("font-size-input"),
      wrapToggle: document.getElementById("wrap-toggle"),
      formatBtn: document.getElementById("format-btn"),
      copyBtn: document.getElementById("copy-btn"),
      generateImageBtn: document.getElementById("generate-image-btn"),
      recordVideoBtn: document.getElementById("record-video-btn"),
      editorContainer: document.getElementById("editor-container"),
      imageModal: document.getElementById("image-modal"),
      imageContainer: document.getElementById("image-container"),
      downloadBtn: document.getElementById("download-btn"),
      closeModal: document.getElementById("close-modal"),
      videoModal: document.getElementById("video-modal"),
      videoContainer: document.getElementById("video-container"),
      downloadVideoBtn: document.getElementById("download-video-btn"),
      closeVideoModal: document.getElementById("close-video-modal"),
      recordingIndicator: document.getElementById("recording-indicator")
    },
    state: {
      generatedImageUrl: null,
      recordedChunks: [],
      mediaRecorder: null,
      isRecording: false
    },
    // 更新行号
    updateLineNumbers: function() {
      const content = this.elements.codeInput.value;
      const lines = content.split("\n");
      const lineCount = lines.length;
      
      let lineNumbersHTML = "";
      for (let i = 1; i <= lineCount; i++) {
        lineNumbersHTML += `<div>${i}</div>`;
      }
      
      this.elements.lineNumbers.innerHTML = lineNumbersHTML;
    },
    
    // 更新代码高亮
    updateHighlight: function() {
      const code = this.elements.codeInput.value;
      const language = this.elements.languageSelect.value;
      
      // 设置代码和语言
      this.elements.codeDisplay.innerHTML = `<code class="hljs language-${language}">${code}</code>`;
      
      // 应用高亮
      document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block);
      });
    },
    
    // 初始化事件监听
    initEvents: function() {
      const self = this;
      
      // 代码输入事件
      this.elements.codeInput.addEventListener("input", function() {
        self.updateLineNumbers();
        self.updateHighlight();
      });
      
      // 语言切换事件
      this.elements.languageSelect.addEventListener("change", function() {
        self.updateHighlight();
      });
      
      // 字体大小调整
      this.elements.fontSizeInput.addEventListener("change", function() {
        const fontSize = this.value + "px";
        self.elements.codeInput.style.fontSize = fontSize;
        self.elements.codeDisplay.style.fontSize = fontSize;
        self.elements.lineNumbers.style.fontSize = fontSize;
      });
    }
  };
  
  // 初始化事件
  CodePoster.initEvents();
  
  // 初始化编辑器
  CodePoster.updateLineNumbers();
  CodePoster.updateHighlight();
});