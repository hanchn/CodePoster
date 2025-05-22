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
    
    // JavaScript格式化 - 改进版
    function formatJavaScript(code) {
      // 使用更复杂的逻辑处理JavaScript代码
      let formatted = '';
      let indentLevel = 0;
      let inString = false;
      let stringChar = '';
      let inComment = false;
      let inMultilineComment = false;
      
      // 预处理：规范化换行符
      code = code.replace(/\r\n/g, '\n');
      
      // 将代码拆分为行
      const lines = code.split('\n');
      
      // 处理每一行
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // 跳过空行，但保留空行
        if (line === '') {
          formatted += '\n';
          continue;
        }
        
        // 处理注释行
        if (line.startsWith('//')) {
          formatted += '  '.repeat(indentLevel) + line + '\n';
          continue;
        }
        
        // 处理多行注释开始
        if (line.startsWith('/*')) {
          inMultilineComment = !line.includes('*/');
          formatted += '  '.repeat(indentLevel) + line + '\n';
          continue;
        }
        
        // 处理多行注释结束
        if (inMultilineComment) {
          inMultilineComment = !line.includes('*/');
          formatted += '  '.repeat(indentLevel) + line + '\n';
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
        const shouldIncreaseIndent = (
          line.endsWith('{') || 
          (line.endsWith('(') && !line.includes(')')) || 
          (line.endsWith('[') && !line.includes(']')) || 
          line.endsWith('=>') && !line.includes('{') ||
          line.endsWith(':') && !line.includes(';')
        );
        
        if (shouldIncreaseIndent) {
          indentLevel++;
        }
        
        // 处理行内的闭合括号
        const openBrackets = (line.match(/\{/g) || []).length;
        const closeBrackets = (line.match(/\}/g) || []).length;
        if (closeBrackets > openBrackets && !line.startsWith('}')) {
          indentLevel = Math.max(0, indentLevel - (closeBrackets - openBrackets));
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
    
    // HTML格式化 - 改进版
    function formatHTML(code) {
      let formatted = '';
      let indentLevel = 0;
      
      // 预处理：规范化换行符
      code = code.replace(/\r\n/g, '\n');
      
      // 预处理：在标签前后添加换行符
      code = code.replace(/>\s*</g, '>\n<');
      
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
        
        // 检查是否是闭合标签或自闭合标签
        const isClosingTag = line.startsWith('</');
        const isSelfClosingTag = line.endsWith('/>');
        const isSpecialTag = line.startsWith('<!') || line.startsWith('<?');
        
        // 减少缩进级别（针对闭合标签）
        if (isClosingTag) {
          indentLevel = Math.max(0, indentLevel - 1);
        }
        
        // 添加缩进
        const indent = '  '.repeat(indentLevel);
        formatted += indent + line + '\n';
        
        // 增加缩进级别（针对开始标签，但不包括自闭合标签和特殊标签）
        if (!isClosingTag && !isSelfClosingTag && !isSpecialTag && line.includes('<') && line.includes('>')) {
          // 排除自闭合标签
          const tagMatch = line.match(/<([a-zA-Z0-9]+)/);
          if (tagMatch) {
            const tag = tagMatch[1].toLowerCase();
            const selfClosingTags = ['img', 'br', 'hr', 'input', 'link', 'meta', 'source', 'track', 'wbr', 'area', 'base', 'col', 'embed', 'param', 'slot'];
            if (!selfClosingTags.includes(tag)) {
              indentLevel++;
            }
          }
        }
      }
      
      return formatted.trim();
    }
    
    // CSS格式化 - 改进版
    function formatCSS(code) {
      let formatted = '';
      let indentLevel = 0;
      
      // 预处理：规范化换行符
      code = code.replace(/\r\n/g, '\n');
      
      // 预处理：在大括号前后添加换行符
      code = code.replace(/\s*\{\s*/g, ' {\n');
      code = code.replace(/\s*\}\s*/g, '\n}\n');
      
      // 预处理：在分号后添加换行符
      code = code.replace(/;\s*/g, ';\n');
      
      // 将代码拆分为行
      const lines = code.split('\n');
      
      // 处理每一行
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // 跳过空行
        if (line === '') {
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
    
    // Python格式化 - 改进版
    function formatPython(code) {
      let formatted = '';
      let indentLevel = 0;
      let pendingIndent = false;
      
      // 预处理：规范化换行符
      code = code.replace(/\r\n/g, '\n');
      
      // 将代码拆分为行
      const lines = code.split('\n');
      
      // 处理每一行
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // 跳过空行，但保留空行
        if (line === '') {
          formatted += '\n';
          continue;
        }
        
        // 应用待处理的缩进
        if (pendingIndent) {
          indentLevel++;
          pendingIndent = false;
        }
        
        // 检查是否需要减少缩进
        if (i > 0 && indentLevel > 0) {
          const prevLine = lines[i-1].trim();
          // 如果上一行不是以冒号结束，且当前行不是缩进的，则减少缩进
          if (!prevLine.endsWith(':') && !prevLine.endsWith('\\') && 
              !prevLine.endsWith('(') && !prevLine.endsWith('[') && 
              !line.startsWith(' ') && !line.startsWith('\t')) {
            indentLevel = 0; // 重置缩进级别
          }
        }
        
        // 添加缩进
        const indent = '    '.repeat(indentLevel); // Python使用4个空格
        formatted += indent + line + '\n';
        
        // 检查是否需要增加缩进
        if (line.endsWith(':')) {
          pendingIndent = true;
        }
      }
      
      return formatted.trim();
    }
    
    // C风格语言格式化（C, C++, Java, C#等）
    function formatCStyle(code) {
      let formatted = '';
      let indentLevel = 0;
      
      // 预处理：规范化换行符
      code = code.replace(/\r\n/g, '\n');
      
      // 预处理：在大括号前后添加换行符
      code = code.replace(/\s*\{\s*/g, ' {\n');
      code = code.replace(/\s*\}\s*/g, '\n}\n');
      
      // 将代码拆分为行
      const lines = code.split('\n');
      
      // 处理每一行
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // 跳过空行，但保留空行
        if (line === '') {
          formatted += '\n';
          continue;
        }
        
        // 处理注释行
        if (line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
          formatted += '  '.repeat(indentLevel) + line + '\n';
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
        if (line.endsWith('{')) {
          indentLevel++;
        }
        
        // 处理行内的闭合括号
        const openBrackets = (line.match(/\{/g) || []).length;
        const closeBrackets = (line.match(/\}/g) || []).length;
        if (closeBrackets > openBrackets && !line.startsWith('}')) {
          indentLevel = Math.max(0, indentLevel - (closeBrackets - openBrackets));
        }
      }
      
      return formatted.trim();
    }
    
    // 通用格式化（适用于所有语言）- 改进版
    function formatGeneric(code) {
      let formatted = '';
      let indentLevel = 0;
      
      // 预处理：规范化换行符
      code = code.replace(/\r\n/g, '\n');
      
      // 将代码拆分为行
      const lines = code.split('\n');
      
      // 处理每一行
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // 跳过空行，但保留空行
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