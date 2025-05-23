// 主题切换功能
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块和事件系统加载完成
  setTimeout(() => {
    if (!window.CodePoster || !CodePoster.events) return;
    
    // 注册主题切换事件处理函数
    CodePoster.events.onThemeChange = function(theme) {
      if (theme === "light") {
        // 浅色主题
        document.body.style.backgroundColor = "#f5f5f5";
        document.body.style.color = "#1a1a1a";
        CodePoster.elements.editorContainer.style.backgroundColor = "#ffffff";
        CodePoster.elements.lineNumbers.style.backgroundColor = "#f0f0f0";
        CodePoster.elements.lineNumbers.style.color = "#666666";
        CodePoster.elements.codeInput.style.color = "transparent";
        CodePoster.elements.codeInput.style.caretColor = "#000000"; // 浅色主题下光标改为黑色
        CodePoster.elements.codeDisplay.style.color = "#1a1a1a";
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
        CodePoster.elements.editorContainer.style.backgroundColor = "#252526";
        CodePoster.elements.lineNumbers.style.backgroundColor = "#1e1e1e";
        CodePoster.elements.lineNumbers.style.color = "#858585";
        CodePoster.elements.codeInput.style.color = "transparent";
        CodePoster.elements.codeInput.style.caretColor = "#ffffff"; // 深色主题下光标为白色
        CodePoster.elements.codeDisplay.style.color = "#d4d4d4";
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
          select.style.border = "1px solid #444";
        });
        inputs.forEach(input => {
          input.style.backgroundColor = "#3c3c3c";
          input.style.color = "#d4d4d4";
          input.style.border = "1px solid #444";
        });
      }
    };
  }, 150);
});