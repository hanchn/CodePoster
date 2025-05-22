// 编辑器基本功能
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块加载完成
  setTimeout(() => {
    if (!window.CodePoster) return;
    
    // 复制代码
    CodePoster.elements.copyBtn.addEventListener("click", function () {
      try {
        // 使用现代API进行复制
        navigator.clipboard.writeText(CodePoster.elements.codeInput.value).then(() => {
          // 显示复制成功提示
          const originalText = this.textContent;
          this.textContent = "复制成功!";
          setTimeout(() => {
            this.textContent = originalText;
          }, 1500);
        }).catch(err => {
          // 如果现代API失败，回退到传统方法
          CodePoster.elements.codeInput.select();
          document.execCommand("copy");
          
          // 显示复制成功提示
          const originalText = this.textContent;
          this.textContent = "复制成功!";
          setTimeout(() => {
            this.textContent = originalText;
          }, 1500);
        });
      } catch (error) {
        alert("复制失败: " + error.message);
      }
    });
    
    // 自动换行切换
    CodePoster.elements.wrapToggle.addEventListener("change", function () {
      if (this.checked) {
        CodePoster.elements.codeInput.style.whiteSpace = "pre-wrap";
        CodePoster.elements.codeDisplay.style.whiteSpace = "pre-wrap";
        CodePoster.elements.codeDisplay.querySelector("code").style.whiteSpace = "pre-wrap";
      } else {
        CodePoster.elements.codeInput.style.whiteSpace = "pre";
        CodePoster.elements.codeDisplay.style.whiteSpace = "pre";
        CodePoster.elements.codeDisplay.querySelector("code").style.whiteSpace = "pre";
      }
    });
  }, 100);
});