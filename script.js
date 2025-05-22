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
    codeInput.select();
    document.execCommand("copy");

    // 显示复制成功提示
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "复制成功!";
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 1500);
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

  // 生成图片 - 不包含底部工具栏
  generateImageBtn.addEventListener("click", function () {
    // 创建一个临时容器，只包含编辑器的主要部分
    const tempContainer = document.createElement("div");
    tempContainer.style.display = "flex";
    tempContainer.style.backgroundColor = "#1e1e1e";
    tempContainer.style.borderRadius = "8px";
    tempContainer.style.overflow = "hidden";
    tempContainer.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";

    // 克隆行号区域
    const lineNumbersClone = lineNumbers.cloneNode(true);
    tempContainer.appendChild(lineNumbersClone);

    // 创建代码区域容器
    const codeAreaClone = document.createElement("div");
    codeAreaClone.style.flex = "1";
    codeAreaClone.style.display = "flex";
    codeAreaClone.style.backgroundColor = "#252526";

    // 克隆编辑器区域
    const editorClone = document.createElement("div");
    editorClone.style.flex = "1";
    editorClone.style.display = "flex";
    editorClone.style.overflow = "hidden";

    // 克隆编辑器内容
    const editorWrapperClone = document.createElement("div");
    editorWrapperClone.style.flex = "1";
    editorWrapperClone.style.position = "relative";
    editorWrapperClone.style.overflow = "auto";

    // 克隆代码显示区域
    const codeDisplayClone = document.createElement("div");
    codeDisplayClone.innerHTML = codeDisplay.innerHTML;
    codeDisplayClone.style.padding = "10px";
    codeDisplayClone.style.fontFamily =
      "Menlo, Monaco, Courier New, monospace";
    codeDisplayClone.style.fontSize =
      codeDisplay.style.fontSize || "14px";
    codeDisplayClone.style.lineHeight =
      codeDisplay.style.lineHeight || "20px";
    codeDisplayClone.style.whiteSpace =
      codeDisplay.style.whiteSpace || "pre";

    editorWrapperClone.appendChild(codeDisplayClone);
    editorClone.appendChild(editorWrapperClone);
    codeAreaClone.appendChild(editorClone);

    tempContainer.appendChild(codeAreaClone);

    // 设置临时容器的尺寸
    tempContainer.style.width = editorContainer.offsetWidth + "px";
    // 计算高度时排除工具栏高度
    const toolbarHeight = document.querySelector(".toolbar").offsetHeight;
    tempContainer.style.height =
      editorContainer.offsetHeight - toolbarHeight + "px";

    // 将临时容器添加到文档中但不可见
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    document.body.appendChild(tempContainer);

    // 使用html2canvas截取临时容器
    html2canvas(tempContainer, {
      backgroundColor: "#1e1e1e",
      scale: 2, // 提高图片质量
      logging: false,
      useCORS: true,
    })
      .then((canvas) => {
        // 显示生成的图片
        imageContainer.innerHTML = "";
        const img = document.createElement("img");
        generatedImageUrl = canvas.toDataURL("image/png");
        img.src = generatedImageUrl;
        imageContainer.appendChild(img);

        // 显示模态框
        imageModal.style.display = "flex";

        // 移除临时容器
        document.body.removeChild(tempContainer);
      })
      .catch((error) => {
        alert("生成图片失败: " + error.message);
        // 确保临时容器被移除
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
      });
  });

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
    document.body.style.backgroundColor = "#f5f5f5";
    document.body.style.color = "#333";
    editorContainer.style.backgroundColor = "#fff";
    lineNumbers.style.backgroundColor = "#eee";
    lineNumbers.style.color = "#666";
    // ... existing code ...
  } else {
    document.body.style.backgroundColor = "#1e1e1e";
    document.body.style.color = "#d4d4d4";
    editorContainer.style.backgroundColor = "#252526";
    lineNumbers.style.backgroundColor = "#1e1e1e";
    lineNumbers.style.color = "#858585";
    // ... existing code ...
  }
});
