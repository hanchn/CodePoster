// 编辑器工具函数
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块加载完成
  setTimeout(() => {
    if (!window.CodePoster) return;
    
    // 初始化编辑器高度设置
    if (!CodePoster.state.editorHeight) {
      CodePoster.state.editorHeight = { value: 0 };
    }
    
    // 导出函数到全局对象
    window.applyEditorHeight = applyEditorHeight;
    
    // 应用编辑器高度设置函数
    function applyEditorHeight() {
      const height = CodePoster.state.editorHeight.value;
      
      // 获取编辑器容器
      const editorContainer = CodePoster.elements.editorContainer;
      
      // 设置编辑器容器的基本样式
      editorContainer.style.display = 'flex';
      editorContainer.style.width = '100%';
      editorContainer.style.position = 'relative';
      
      // 设置行号区域样式
      CodePoster.elements.lineNumbers.style.overflowY = 'hidden'; // 隐藏行号区域的滚动条
      CodePoster.elements.lineNumbers.style.flexShrink = '0'; // 防止行号区域被压缩
      CodePoster.elements.lineNumbers.style.borderRight = '1px solid #444'; // 添加分隔线
      
      if (height > 0) {
        // 设置固定高度
        editorContainer.style.height = height + 'px';
        
        // 设置编辑器组件高度
        CodePoster.elements.codeInput.style.height = '100%';
        CodePoster.elements.codeDisplay.style.height = '100%';
        CodePoster.elements.lineNumbers.style.height = '100%';
        
        // 只在垂直方向显示滚动条
        CodePoster.elements.codeInput.style.overflowY = 'auto';
        CodePoster.elements.codeInput.style.overflowX = 'hidden';
        CodePoster.elements.codeDisplay.style.overflowY = 'auto';
        CodePoster.elements.codeDisplay.style.overflowX = 'hidden';
      } else {
        // 自适应高度模式
        editorContainer.style.height = 'auto';
        
        // 重置编辑器组件高度
        CodePoster.elements.codeInput.style.height = 'auto';
        CodePoster.elements.codeDisplay.style.height = 'auto';
        CodePoster.elements.lineNumbers.style.height = 'auto';
        
        // 设置最小高度
        CodePoster.elements.codeInput.style.minHeight = '200px';
        CodePoster.elements.codeDisplay.style.minHeight = '200px';
        CodePoster.elements.lineNumbers.style.minHeight = '200px';
        
        // 只在垂直方向显示滚动条
        CodePoster.elements.codeInput.style.overflowY = 'auto';
        CodePoster.elements.codeInput.style.overflowX = 'hidden';
        CodePoster.elements.codeDisplay.style.overflowY = 'auto';
        CodePoster.elements.codeDisplay.style.overflowX = 'hidden';
      }
      
      // 设置代码编辑器的文本样式
      const textStyles = {
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        wordBreak: 'normal', // 改用 normal 而不是 break-all，以保持单词完整性
        width: '100%',
        boxSizing: 'border-box',
        padding: '10px',
        lineHeight: '1.5',
        tabSize: '2'
      };
      
      // 应用文本样式到输入和显示区域
      Object.assign(CodePoster.elements.codeInput.style, textStyles);
      Object.assign(CodePoster.elements.codeDisplay.style, textStyles);
      
      // 设置滚动条样式
      const scrollbarStyle = `
        ::-webkit-scrollbar {
          width: 8px;
          height: 0px; // 隐藏水平滚动条
        }
        ::-webkit-scrollbar-track {
          background: #2a2a2a;
        }
        ::-webkit-scrollbar-thumb {
          background: #555;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #777;
        }
      `;
      
      // 添加滚动条样式
      if (!document.getElementById('scrollbar-style')) {
        const styleEl = document.createElement('style');
        styleEl.id = 'scrollbar-style';
        styleEl.textContent = scrollbarStyle;
        document.head.appendChild(styleEl);
      }
      
      // 强制重新计算布局
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 10);
    }
  }, 100);
});