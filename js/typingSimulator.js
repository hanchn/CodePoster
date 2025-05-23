// 模拟打字效果功能
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块加载完成
  setTimeout(() => {
    if (!window.CodePoster) return;
    
    // 初始化打字速度设置
    if (!CodePoster.state.typingSpeed) {
      CodePoster.state.typingSpeed = { value: 50 };
    }
    
    // 导出函数到全局对象
    window.simulateTyping = simulateTyping;
    
    // 模拟打字效果函数
    function simulateTyping(text, speed = null) {
      return new Promise((resolve) => {
        const typingSpeed = speed || (CodePoster.state.typingSpeed ? CodePoster.state.typingSpeed.value : 50);
        const originalCode = CodePoster.elements.codeInput.value;
        CodePoster.elements.codeInput.value = '';
        
        const inputEvent = new Event('input', { bubbles: true });
        CodePoster.elements.codeInput.dispatchEvent(inputEvent);
        
        // 应用编辑器高度
        if (typeof window.applyEditorHeight === 'function') {
          window.applyEditorHeight();
        }
        
        let i = 0;
        
        function typeChar() {
          if (i < text.length) {
            // 添加一个字符
            CodePoster.elements.codeInput.value += text.charAt(i);
            i++;
            
            // 触发input事件以更新高亮和行号
            CodePoster.elements.codeInput.dispatchEvent(inputEvent);
            
            // 自动滚动到底部
            CodePoster.elements.codeInput.scrollTop = CodePoster.elements.codeInput.scrollHeight;
            
            // 同时滚动代码显示区域到底部
            if (CodePoster.elements.codeDisplay) {
              CodePoster.elements.codeDisplay.scrollTop = CodePoster.elements.codeDisplay.scrollHeight;
            }
            
            // 同时滚动行号区域到底部
            if (CodePoster.elements.lineNumbers) {
              CodePoster.elements.lineNumbers.scrollTop = CodePoster.elements.lineNumbers.scrollHeight;
            }
            
            // 使用设置的打字速度，添加少量随机性
            const randomDelay = typingSpeed + Math.random() * (typingSpeed * 0.5);
            setTimeout(typeChar, randomDelay);
          } else {
            resolve();
          }
        }
        
        typeChar();
      });
    }
  }, 100);
});