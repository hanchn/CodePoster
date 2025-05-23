// 代码格式化功能
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块和事件系统加载完成
  setTimeout(() => {
    if (!window.CodePoster || !CodePoster.events) return;
    
    // 注册格式化事件处理函数
    CodePoster.events.onFormat = function() {
      const code = CodePoster.elements.codeInput.value;
      const language = CodePoster.elements.languageSelect.value;
      
      // 根据不同语言进行格式化
      let formattedCode = code;
      
      try {
        switch (language) {
          case "javascript":
          case "typescript":
          case "jsx":
          case "tsx":
            formattedCode = formatJavaScript(code);
            break;
          case "html":
          case "xml":
          case "svg":
            formattedCode = formatHTML(code);
            break;
          case "css":
          case "scss":
          case "less":
            formattedCode = formatCSS(code);
            break;
          case "python":
            formattedCode = formatPython(code);
            break;
          case "java":
          case "c":
          case "cpp":
          case "csharp":
          case "go":
          case "rust":
          case "swift":
            formattedCode = formatCStyle(code);
            break;
          default:
            // 基本格式化（适用于所有语言）
            formattedCode = formatGeneric(code);
        }
        
        // 更新编辑器内容
        CodePoster.elements.codeInput.value = formattedCode;
        
        // 触发input事件以更新高亮和行号
        const event = new Event('input', { bubbles: true });
        CodePoster.elements.codeInput.dispatchEvent(event);
        
        // 显示成功提示
        const formatBtn = CodePoster.elements.formatBtn;
        const originalText = formatBtn.textContent;
        formatBtn.textContent = "格式化成功!";
        setTimeout(() => {
          formatBtn.textContent = originalText;
        }, 1500);
      } catch (error) {
        console.error("格式化失败:", error);
        alert("格式化失败: " + error.message);
      }
    };
    
    // JavaScript格式化 - 改进版
    function formatJavaScript(code) {
      // ... 保持原有的格式化逻辑 ...
    }
    
    // HTML格式化 - 改进版
    function formatHTML(code) {
      // ... 保持原有的格式化逻辑 ...
    }
    
    // CSS格式化
    function formatCSS(code) {
      // ... 保持原有的格式化逻辑 ...
    }
    
    // Python格式化
    function formatPython(code) {
      // ... 保持原有的格式化逻辑 ...
    }
    
    // C风格语言格式化
    function formatCStyle(code) {
      // ... 保持原有的格式化逻辑 ...
    }
    
    // 通用格式化
    function formatGeneric(code) {
      // ... 保持原有的格式化逻辑 ...
    }
  }, 150);
});