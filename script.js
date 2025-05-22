document.addEventListener("DOMContentLoaded", function () {
  const codeInput = document.getElementById("code-input");
  const codeDisplay = document.getElementById("code-display");
  const lineNumbers = document.getElementById("line-numbers");
  const languageSelect = document.getElementById("language-select");
  const formatBtn = document.getElementById("format-btn");
  const copyBtn = document.getElementById("copy-btn");
  const wrapToggle = document.getElementById("wrap-toggle");
  const editorWrapper = document.querySelector(".editor-wrapper");
  const generateImageBtn = document.getElementById("generate-image-btn");
  const imageModal = document.getElementById("image-modal");
  const closeModal = document.getElementById("close-modal");
  const imageContainer = document.getElementById("image-container");
  const downloadBtn = document.getElementById("download-btn");
  const fontSizeInput = document.getElementById("font-size-input");
  const editorContainer = document.getElementById("editor-container");

  // 检查必要的元素是否存在
  if (!codeInput || !codeDisplay || !lineNumbers || !editorContainer) {
    console.error("缺少必要的DOM元素");
    return;
  }

  let generatedImageUrl = null;

  // 初始化行号
  function updateLineNumbers() {
    const lines = codeInput.value.split("\n");
    lineNumbers.innerHTML = "";

    for (let i = 0; i < lines.length; i++) {
      const lineNumber = document.createElement("div");
      lineNumber.textContent = i + 1;
      lineNumbers.appendChild(lineNumber);
    }
  }

  // 初始化代码高亮
  function updateHighlight() {
    const code = codeInput.value;
    const language = languageSelect.value;

    // 使用highlight.js进行代码高亮
    // 转义HTML特殊字符以防止XSS
    const escapedCode = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    codeDisplay.innerHTML = `<pre><code class="hljs language-${language}">${escapedCode}</code></pre>`;
    hljs.highlightElement(codeDisplay.querySelector("code"));
  }

  // 同步滚动 - 修复滚动同步问题
  editorWrapper.addEventListener("scroll", function () {
    codeDisplay.style.top = -editorWrapper.scrollTop + "px";
    codeDisplay.style.left = -editorWrapper.scrollLeft + "px";
    lineNumbers.scrollTop = editorWrapper.scrollTop;
  });

  // 监听输入变化
  codeInput.addEventListener("input", function () {
    updateLineNumbers();
    updateHighlight();
  });

  // 监听语言变化
  languageSelect.addEventListener("change", updateHighlight);

  // 监听字体大小变化
  fontSizeInput.addEventListener("change", function () {
    const fontSize = this.value + "px";
    codeInput.style.fontSize = fontSize;
    codeDisplay.style.fontSize = fontSize;

    // 调整行高以匹配字体大小
    const lineHeight = Math.max(parseInt(this.value) + 6, 20) + "px";
    codeInput.style.lineHeight = lineHeight;
    codeDisplay.style.lineHeight = lineHeight;

    // 调整行号字体大小
    lineNumbers.style.fontSize = fontSize;

    // 调整行号行高
    const lineNumberDivs = lineNumbers.querySelectorAll("div");
    lineNumberDivs.forEach((div) => {
      div.style.height = lineHeight;
      div.style.lineHeight = lineHeight;
    });
  });

  // 格式化代码 - 修复格式化功能
  formatBtn.addEventListener("click", function () {
    try {
      const language = languageSelect.value;
      let formattedCode = codeInput.value;

      // 根据不同语言进行格式化
      if (language === "javascript") {
        try {
          // 尝试使用JSON格式化（适用于JS对象）
          const parsed = JSON.parse(formattedCode);
          formattedCode = JSON.stringify(parsed, null, 2);
        } catch (e) {
          // 不是有效的JSON，使用简单的缩进格式化
          formattedCode = formatJavaScript(formattedCode);
        }
      } else if (language === "html") {
        formattedCode = formatHTML(formattedCode);
      } else if (language === "css") {
        formattedCode = formatCSS(formattedCode);
      } else if (language === "java") {
        formattedCode = formatJava(formattedCode);
      } else if (language === "python") {
        formattedCode = formatPython(formattedCode);
      }

      codeInput.value = formattedCode;
      updateLineNumbers();
      updateHighlight();
    } catch (error) {
      alert("格式化失败: " + error.message);
    }
  });

  // 简单的JavaScript格式化函数
  function formatJavaScript(code) {
    let result = "";
    let indentLevel = 0;
    let inString = false;
    let stringChar = "";

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const nextChar = code[i + 1] || "";

      // 处理字符串
      if (
        (char === '"' || char === "'" || char === "`") &&
        (i === 0 || code[i - 1] !== "\\")
      ) {
        if (inString && stringChar === char) {
          inString = false;
        } else if (!inString) {
          inString = true;
          stringChar = char;
        }
      }

      if (!inString) {
        // 处理缩进
        if (char === "{" || char === "[") {
          result += char;
          indentLevel++;
          result += "\n" + "  ".repeat(indentLevel);
          continue;
        } else if (char === "}" || char === "]") {
          indentLevel--;
          result += "\n" + "  ".repeat(indentLevel) + char;
          continue;
        } else if (char === ";") {
          result += char;
          result += "\n" + "  ".repeat(indentLevel);
          continue;
        } else if (
          char === "," &&
          nextChar !== " " &&
          nextChar !== "\n"
        ) {
          result += char + " ";
          continue;
        } else if (char === "\n") {
          result += "\n" + "  ".repeat(indentLevel);
          continue;
        }
      }

      result += char;
    }

    return result;
  }

  // 简单的HTML格式化函数
  function formatHTML(code) {
    let result = "";
    let indentLevel = 0;
    let inTag = false;

    for (let i = 0; i < code.length; i++) {
      const char = code[i];

      if (char === "<" && code[i + 1] !== "/") {
        result += "\n" + "  ".repeat(indentLevel) + char;
        inTag = true;
        if (code.substr(i + 1, 4) !== "!--") {
          indentLevel++;
        }
      } else if (char === "<" && code[i + 1] === "/") {
        indentLevel--;
        result += "\n" + "  ".repeat(indentLevel) + char;
        inTag = true;
      } else if (char === ">") {
        result += char;
        inTag = false;
        if (code[i - 1] === "/") {
          indentLevel--;
        }
      } else {
        result += char;
      }
    }

    return result;
  }

  // 简单的CSS格式化函数
  function formatCSS(code) {
    let result = "";
    let indentLevel = 0;

    for (let i = 0; i < code.length; i++) {
      const char = code[i];

      if (char === "{") {
        result += " " + char + "\n" + "  ".repeat(++indentLevel);
      } else if (char === "}") {
        result += "\n" + "  ".repeat(--indentLevel) + char + "\n";
      } else if (char === ";") {
        result += char + "\n" + "  ".repeat(indentLevel);
      } else if (char === "\n") {
        result += "\n" + "  ".repeat(indentLevel);
      } else {
        result += char;
      }
    }

    return result;
  }

  // 简单的Java格式化函数
  function formatJava(code) {
    return formatJavaScript(code); // 使用JavaScript格式化函数作为基础
  }

  // 简单的Python格式化函数
  function formatPython(code) {
    let result = "";
    let lines = code.split("\n");

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      let indentLevel = 0;

      // 计算缩进级别
      for (let j = 0; j < i; j++) {
        if (lines[j].trim().endsWith(":")) {
          indentLevel++;
        }
        if (
          lines[j].trim() === "" &&
          j > 0 &&
          !lines[j - 1].trim().endsWith(":")
        ) {
          indentLevel--;
        }
      }

      if (line.length > 0) {
        result += "  ".repeat(Math.max(0, indentLevel)) + line + "\n";
      } else {
        result += "\n";
      }
    }

    return result;
  }

  // 复制代码
  copyBtn.addEventListener("click", function () {
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

  // 自动换行切换 - 修复自动换行功能
  wrapToggle.addEventListener("change", function () {
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

  // 处理Tab键
  codeInput.addEventListener("keydown", function (e) {
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

  // 生成图片功能
  if (generateImageBtn) {
    generateImageBtn.addEventListener("click", async function () {
      try {
        console.log("生成图片按钮被点击");
        
        // 创建一个临时容器
        const tempContainer = document.createElement("div");
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        tempContainer.style.top = "-9999px";
        tempContainer.style.width = editorContainer.offsetWidth + "px";
        tempContainer.style.height = (editorContainer.offsetHeight - document.querySelector(".toolbar").offsetHeight) + "px";
        tempContainer.style.backgroundColor = editorContainer.style.backgroundColor;
        tempContainer.style.borderRadius = "8px";
        tempContainer.style.overflow = "hidden";
        tempContainer.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";
        tempContainer.style.display = "flex";

        // 克隆行号区域
        const lineNumbersClone = lineNumbers.cloneNode(true);
        lineNumbersClone.style.width = "60px";
        lineNumbersClone.style.backgroundColor = lineNumbers.style.backgroundColor;
        lineNumbersClone.style.color = lineNumbers.style.color;
        tempContainer.appendChild(lineNumbersClone);

        // 克隆代码显示区域
        const codeDisplayClone = document.createElement("div");
        codeDisplayClone.style.flex = "1";
        codeDisplayClone.style.padding = "10px";
        codeDisplayClone.style.fontFamily = "Menlo, Monaco, Courier New, monospace";
        codeDisplayClone.style.fontSize = codeDisplay.style.fontSize || "14px";
        codeDisplayClone.style.lineHeight = codeDisplay.style.lineHeight || "20px";
        codeDisplayClone.style.whiteSpace = codeDisplay.style.whiteSpace || "pre";
        codeDisplayClone.style.color = codeDisplay.style.color;
        codeDisplayClone.style.backgroundColor = "transparent";
        codeDisplayClone.innerHTML = codeDisplay.innerHTML;
        tempContainer.appendChild(codeDisplayClone);

        // 将临时容器添加到文档中
        document.body.appendChild(tempContainer);

        // 等待一帧以确保样式应用
        await new Promise(resolve => requestAnimationFrame(resolve));

        console.log("开始生成图片");
        // 使用html2canvas截取临时容器
        const canvas = await html2canvas(tempContainer, {
          backgroundColor: null,
          scale: 2,
          logging: true,
          useCORS: true,
          allowTaint: true,
          foreignObjectRendering: true,
          imageTimeout: 0,
          removeContainer: true
        });

        console.log("图片生成完成");
        // 显示生成的图片
        imageContainer.innerHTML = "";
        const img = document.createElement("img");
        generatedImageUrl = canvas.toDataURL("image/png", 1.0);
        img.src = generatedImageUrl;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        imageContainer.appendChild(img);

        // 显示模态框
        imageModal.style.display = "flex";

        // 移除临时容器
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      } catch (error) {
        console.error("生成图片失败:", error);
        alert("生成图片失败: " + error.message);
      }
    });
  } else {
    console.error("未找到生成图片按钮");
  }

  // 下载图片
  downloadBtn.addEventListener("click", function () {
    if (generatedImageUrl) {
      const link = document.createElement("a");
      link.href = generatedImageUrl;
      link.download = `code-editor-${
        languageSelect.value
      }-${new Date().getTime()}.png`;
      link.click();
    }
  });

  // 关闭模态框
  closeModal.addEventListener("click", function () {
    imageModal.style.display = "none";
  });

  // 点击模态框背景关闭
  imageModal.addEventListener("click", function (e) {
    if (e.target === imageModal) {
      imageModal.style.display = "none";
    }
  });

  // 初始化
  updateLineNumbers();
  updateHighlight();
});

// 主题切换
const themeSelect = document.getElementById("theme-select");
themeSelect.addEventListener("change", function() {
  const theme = this.value;
  if (theme === "light") {
    // 浅色主题
    document.body.style.backgroundColor = "#f5f5f5";
    document.body.style.color = "#1a1a1a";
    editorContainer.style.backgroundColor = "#ffffff";
    lineNumbers.style.backgroundColor = "#f0f0f0";
    lineNumbers.style.color = "#666666";
    codeInput.style.color = "#1a1a1a";
    codeDisplay.style.color = "#1a1a1a";
    document.querySelector(".toolbar").style.backgroundColor = "#e8e8e8";
    document.querySelector(".toolbar").style.borderTop = "1px solid #d0d0d0";
    
    // 调整按钮颜色
    const buttons = document.querySelectorAll("button:not(.record-btn):not(.pause-btn):not(.stop-btn)");
    buttons.forEach(button => {
      button.style.backgroundColor = "#0066cc";
      button.style.color = "#ffffff";
    });
    
    // 调整选择器和输入框
    const selects = document.querySelectorAll("select");
    const inputs = document.querySelectorAll("input[type='number']");
    selects.forEach(select => {
      select.style.backgroundColor = "#ffffff";
      select.style.color = "#1a1a1a";
      select.style.border = "1px solid #cccccc";
    });
    inputs.forEach(input => {
      input.style.backgroundColor = "#ffffff";
      input.style.color = "#1a1a1a";
      input.style.border = "1px solid #cccccc";
    });
  } else {
    // 深色主题
    document.body.style.backgroundColor = "#1e1e1e";
    document.body.style.color = "#d4d4d4";
    editorContainer.style.backgroundColor = "#252526";
    lineNumbers.style.backgroundColor = "#1e1e1e";
    lineNumbers.style.color = "#858585";
    codeInput.style.color = "#d4d4d4";
    codeDisplay.style.color = "#d4d4d4";
    document.querySelector(".toolbar").style.backgroundColor = "#2d2d2d";
    document.querySelector(".toolbar").style.borderTop = "1px solid #444";
    
    // 恢复按钮颜色
    const buttons = document.querySelectorAll("button:not(.record-btn):not(.pause-btn):not(.stop-btn)");
    buttons.forEach(button => {
      button.style.backgroundColor = "#0e639c";
      button.style.color = "#ffffff";
    });
    
    // 恢复选择器和输入框
    const selects = document.querySelectorAll("select");
    const inputs = document.querySelectorAll("input[type='number']");
    selects.forEach(select => {
      select.style.backgroundColor = "#3c3c3c";
      select.style.color = "#d4d4d4";
      select.style.border = "1px solid #555";
    });
    inputs.forEach(input => {
      input.style.backgroundColor = "#3c3c3c";
      input.style.color = "#d4d4d4";
      input.style.border = "1px solid #555";
    });
  }
});

// 视频录制功能
const recordVideoBtn = document.getElementById("record-video-btn");
const videoModal = document.getElementById("video-modal");
const closeVideoModal = document.getElementById("close-video-modal");
const videoContainer = document.getElementById("video-container");
const downloadVideoBtn = document.getElementById("download-video-btn");
const recordingIndicator = document.getElementById("recording-indicator");

// 暂时禁用视频录制功能
recordVideoBtn.style.opacity = "0.5";
recordVideoBtn.style.cursor = "not-allowed";
recordVideoBtn.disabled = true;

let mediaRecorder = null;
let recordedChunks = [];
let isRecording = false;

recordVideoBtn.addEventListener("click", async function() {
  try {
    if (!isRecording) {
      // 开始录制
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: "screen",
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: true
      });

      mediaRecorder = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9"
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
          type: "video/webm"
        });
        const videoUrl = URL.createObjectURL(blob);
        
        // 显示录制的视频
        videoContainer.innerHTML = "";
        const video = document.createElement("video");
        video.src = videoUrl;
        video.controls = true;
        video.autoplay = true;
        videoContainer.appendChild(video);
        
        // 显示视频预览模态框
        videoModal.style.display = "flex";
        
        // 更新下载按钮
        downloadVideoBtn.onclick = () => {
          const link = document.createElement("a");
          link.href = videoUrl;
          link.download = `code-editor-recording-${new Date().getTime()}.webm`;
          link.click();
        };
      };

      mediaRecorder.start();
      isRecording = true;
      recordVideoBtn.textContent = "停止录制";
      recordingIndicator.classList.add("active");
    } else {
      // 停止录制
      mediaRecorder.stop();
      isRecording = false;
      recordVideoBtn.textContent = "视频录制";
      recordingIndicator.classList.remove("active");
      
      // 停止所有轨道
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
  } catch (error) {
    alert("录制失败: " + error.message);
    isRecording = false;
    recordVideoBtn.textContent = "视频录制";
    recordingIndicator.classList.remove("active");
  }
});

// 关闭视频预览模态框
closeVideoModal.addEventListener("click", function() {
  videoModal.style.display = "none";
});

// 点击视频模态框背景关闭
videoModal.addEventListener("click", function(e) {
  if (e.target === videoModal) {
    videoModal.style.display = "none";
  }
});
