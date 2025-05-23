// 事件系统模块
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块加载完成
  setTimeout(() => {
    if (!window.CodePoster) return;
    
    // 初始化事件系统
    CodePoster.events = {
      // 格式化事件
      onFormat: null,
      
      // 复制事件
      onCopy: null,
      
      // 生成图片事件
      onGenerateImage: null,
      
      // 视频录制事件
      onRecordVideo: null,
      
      // 换行切换事件
      onWrapToggle: null,
      
      // 语言切换事件
      onLanguageChange: null,
      
      // 字体大小调整事件
      onFontSizeChange: null,
      
      // 主题切换事件
      onThemeChange: null
    };
  }, 50); // 较早初始化事件系统
});