// 编辑器基本功能
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块和事件系统加载完成
  setTimeout(() => {
    if (!window.CodePoster || !CodePoster.events) return;
    
    // 注册复制事件处理函数
    CodePoster.events.onCopy = function(buttonElement) {
      try {
        // 使用现代API进行复制
        navigator.clipboard.writeText(CodePoster.elements.codeInput.value).then(() => {
          // 显示复制成功提示
          const originalText = buttonElement.textContent;
          buttonElement.textContent = "复制成功!";
          setTimeout(() => {
            buttonElement.textContent = originalText;
          }, 1500);
        }).catch(err => {
          // 如果现代API失败，回退到传统方法
          CodePoster.elements.codeInput.select();
          document.execCommand("copy");
          
          // 显示复制成功提示
          const originalText = buttonElement.textContent;
          buttonElement.textContent = "复制成功!";
          setTimeout(() => {
            buttonElement.textContent = originalText;
          }, 1500);
        });
      } catch (error) {
        alert("复制失败: " + error.message);
      }
    };
    
    // 注册换行切换事件处理函数
    CodePoster.events.onWrapToggle = function(isChecked) {
      if (isChecked) {
        CodePoster.elements.codeInput.style.whiteSpace = "pre-wrap";
        CodePoster.elements.codeDisplay.style.whiteSpace = "pre-wrap";
        CodePoster.elements.codeDisplay.querySelector("code").style.whiteSpace = "pre-wrap";
      } else {
        CodePoster.elements.codeInput.style.whiteSpace = "pre";
        CodePoster.elements.codeDisplay.style.whiteSpace = "pre";
        CodePoster.elements.codeDisplay.querySelector("code").style.whiteSpace = "pre";
      }
    };
    
    // 注册语言切换事件处理函数
    CodePoster.events.onLanguageChange = function(language) {
      CodePoster.functions.updateHighlight();
    };
    
    // 注册字体大小调整事件处理函数
    CodePoster.events.onFontSizeChange = function(fontSize) {
      fontSize = fontSize + "px";
      CodePoster.elements.codeInput.style.fontSize = fontSize;
      CodePoster.elements.codeDisplay.style.fontSize = fontSize;
      CodePoster.elements.lineNumbers.style.fontSize = fontSize;
      
      // 确保行高也相应调整，解决光标位置问题
      const lineHeight = Math.round(parseInt(fontSize) * 1.4) + "px";
      CodePoster.elements.codeInput.style.lineHeight = lineHeight;
      CodePoster.elements.codeDisplay.style.lineHeight = lineHeight;
      CodePoster.elements.lineNumbers.style.lineHeight = lineHeight;
    };
    
    // 处理Tab键
    CodePoster.elements.codeInput.addEventListener("keydown", function(e) {
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
        
        CodePoster.functions.updateLineNumbers();
        CodePoster.functions.updateHighlight();
      }
    });
  }, 150);
});