// 工具栏管理模块
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块加载完成
  setTimeout(() => {
    if (!window.CodePoster) return;
    
    // 初始化工具栏
    initToolbar();
    
    function initToolbar() {
      // 格式化按钮
      if (CodePoster.elements.formatBtn) {
        CodePoster.elements.formatBtn.addEventListener("click", function() {
          // 触发格式化事件
          if (typeof CodePoster.events.onFormat === 'function') {
            CodePoster.events.onFormat();
          }
        });
      }
      
      // 复制代码按钮
      if (CodePoster.elements.copyBtn) {
        CodePoster.elements.copyBtn.addEventListener("click", function() {
          // 触发复制事件
          if (typeof CodePoster.events.onCopy === 'function') {
            CodePoster.events.onCopy(this);
          }
        });
      }
      
      // 生成图片按钮
      if (CodePoster.elements.generateImageBtn) {
        CodePoster.elements.generateImageBtn.addEventListener("click", function() {
          // 触发生成图片事件
          if (typeof CodePoster.events.onGenerateImage === 'function') {
            CodePoster.events.onGenerateImage();
          }
        });
      }
      
      // 视频录制按钮
      if (CodePoster.elements.recordVideoBtn) {
        CodePoster.elements.recordVideoBtn.addEventListener("click", function() {
          // 触发视频录制事件
          if (typeof CodePoster.events.onRecordVideo === 'function') {
            CodePoster.events.onRecordVideo();
          }
        });
      }
      
      // 自动换行切换
      if (CodePoster.elements.wrapToggle) {
        CodePoster.elements.wrapToggle.addEventListener("change", function() {
          // 触发换行切换事件
          if (typeof CodePoster.events.onWrapToggle === 'function') {
            CodePoster.events.onWrapToggle(this.checked);
          }
        });
      }
      
      // 语言选择
      if (CodePoster.elements.languageSelect) {
        CodePoster.elements.languageSelect.addEventListener("change", function() {
          // 触发语言切换事件
          if (typeof CodePoster.events.onLanguageChange === 'function') {
            CodePoster.events.onLanguageChange(this.value);
          }
        });
      }
      
      // 字体大小调整
      if (CodePoster.elements.fontSizeInput) {
        CodePoster.elements.fontSizeInput.addEventListener("change", function() {
          // 触发字体大小调整事件
          if (typeof CodePoster.events.onFontSizeChange === 'function') {
            CodePoster.events.onFontSizeChange(this.value);
          }
        });
      }
      
      // 主题切换
      const themeSelect = document.getElementById("theme-select");
      if (themeSelect) {
        themeSelect.addEventListener("change", function() {
          // 触发主题切换事件
          if (typeof CodePoster.events.onThemeChange === 'function') {
            CodePoster.events.onThemeChange(this.value);
          }
        });
      }
    }
  }, 100);
});