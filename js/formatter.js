// 代码格式化功能
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块加载完成
  setTimeout(() => {
    if (!window.CodePoster) return;
    
    // 格式化按钮点击事件
    CodePoster.elements.formatBtn.addEventListener("click", function() {
      const code = CodePoster.elements.codeInput.value;
      const language = CodePoster.elements.languageSelect.value;
      
      // 根据不同语言进行格式化
      let formattedCode = code;
      
      try {
        switch (language) {
          case "javascript":
            formattedCode = formatJavaScript(code);
            break;
          case "html":
            formattedCode = formatHTML(code);
            break;
          case "css":
            formattedCode = formatCSS(code);
            break;
          case "python":
            formattedCode = formatPython(code);
            break;
          case "java":
            formattedCode = formatJava(code);
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
        const originalText = this.textContent;
        this.textContent = "格式化成功!";
        setTimeout(() => {
          this.textContent = originalText;
        }, 1500);
      } catch (error) {
        console.error("格式化失败:", error);
        alert("格式化失败: " + error.message);
      }
    });
    
    // JavaScript格式化
    function formatJavaScript(code) {
      // 基本的JavaScript格式化
      let formatted = '';
      let indentLevel = 0;
      let inString = false;
      let stringChar = '';
      let inComment = false;
      let inMultilineComment = false;
      let lastChar = '';
      let nextChar = '';
      
      // 将代码拆分为行
      const lines = code.split('\n');
      
      // 处理每一行
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // 跳过空行
        if (line === '') {
          formatted += '\n';
          continue;
        }
        
        // 检查是否需要减少缩进
        if (line.startsWith('}') || line.startsWith(')') || line.startsWith(']')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // 添加缩进
        const indent = '  '.repeat(indentLevel);
        formatted += indent + line + '\n';
        
        // 检查是否需要增加缩进
        if (line.endsWith('{') || line.endsWith('(') || line.endsWith('[') || 
            line.endsWith('=>') || line.endsWith(':')) {
          indentLevel++;
        }
        
        // 如果行以分号结束且下一行不是闭合括号，则不增加缩进
        if (line.endsWith(';') && i < lines.length - 1 && 
            !lines[i+1].trim().startsWith('}') && 
            !lines[i+1].trim().startsWith(')') && 
            !lines[i+1].trim().startsWith(']')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
      }
      
      return formatted.trim();
    }
    
    // HTML格式化
    function formatHTML(code) {
      // 基本的HTML格式化
      let formatted = '';
      let indentLevel = 0;
      let inTag = false;
      let inContent = false;
      
      // 将代码拆分为行
      const lines = code.split('\n');
      
      // 处理每一行
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // 跳过空行
        if (line === '') {
          formatted += '\n';
          continue;
        }
        
        // 检查是否是闭合标签
        if (line.startsWith('</')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // 添加缩进
        const indent = '  '.repeat(indentLevel);
        formatted += indent + line + '\n';
        
        // 检查是否需要增加缩进
        if (line.includes('<') && !line.includes('</') && !line.endsWith('/>') && 
            !line.startsWith('<!') && !line.startsWith('<?')) {
          // 排除自闭合标签和特殊标签
          if (!line.match(/<(img|br|hr|input|link|meta|source|track|wbr|area|base|col|embed|param|slot)\b[^>]*>/i)) {
            indentLevel++;
          }
        }
      }
      
      return formatted.trim();
    }
    
    // CSS格式化
    function formatCSS(code) {
      // 基本的CSS格式化
      let formatted = '';
      let indentLevel = 0;
      
      // 将代码拆分为行
      const lines = code.split('\n');
      
      // 处理每一行
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // 跳过空行
        if (line === '') {
          formatted += '\n';
          continue;
        }
        
        // 检查是否需要减少缩进
        if (line.startsWith('}')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // 添加缩进
        const indent = '  '.repeat(indentLevel);
        
        // 处理属性和值
        if (line.includes(':') && !line.startsWith('@') && !line.includes('{')) {
          const parts = line.split(':');
          if (parts.length >= 2) {
            const property = parts[0].trim();
            const value = parts.slice(1).join(':').trim();
            line = property + ': ' + value;
          }
        }
        
        formatted += indent + line + '\n';
        
        // 检查是否需要增加缩进
        if (line.endsWith('{')) {
          indentLevel++;
        }
      }
      
      return formatted.trim();
    }
    
    // Python格式化
    function formatPython(code) {
      // 基本的Python格式化
      let formatted = '';
      let indentLevel = 0;
      
      // 将代码拆分为行
      const lines = code.split('\n');
      
      // 处理每一行
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // 跳过空行
        if (line === '') {
          formatted += '\n';
          continue;
        }
        
        // 检查是否需要减少缩进
        if (line.startsWith('return') || line.startsWith('break') || 
            line.startsWith('continue') || line.startsWith('raise') || 
            line.startsWith('pass')) {
          // 保持当前缩进级别
        } else if (i > 0 && (lines[i-1].endsWith(':') || 
                  lines[i-1].endsWith('\\') || 
                  lines[i-1].endsWith('('))) {
          indentLevel++;
        }
        
        // 添加缩进
        const indent = '    '.repeat(indentLevel); // Python使用4个空格
        formatted += indent + line + '\n';
        
        // 检查是否需要减少缩进
        if (i < lines.length - 1 && 
            indentLevel > 0 && 
            lines[i+1].trim() !== '' && 
            !lines[i+1].trim().startsWith(' ') && 
            !lines[i+1].trim().startsWith('\t')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
      }
      
      return formatted.trim();
    }
    
    // Java格式化
    function formatJava(code) {
      // 基本的Java格式化（类似JavaScript）
      return formatJavaScript(code);
    }
    
    // 通用格式化（适用于所有语言）
    function formatGeneric(code) {
      // 基本的通用格式化
      let formatted = '';
      let indentLevel = 0;
      
      // 将代码拆分为行
      const lines = code.split('\n');
      
      // 处理每一行
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // 跳过空行
        if (line === '') {
          formatted += '\n';
          continue;
        }
        
        // 检查是否需要减少缩进
        if (line.startsWith('}') || line.startsWith(')') || line.startsWith(']')) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // 添加缩进
        const indent = '  '.repeat(indentLevel);
        formatted += indent + line + '\n';
        
        // 检查是否需要增加缩进
        if (line.endsWith('{') || line.endsWith('(') || line.endsWith('[')) {
          indentLevel++;
        }
      }
      
      return formatted.trim();
    }
  }, 100);
});