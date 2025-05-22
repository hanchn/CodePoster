// 代码格式化相关功能
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块加载完成
  setTimeout(() => {
    if (!window.CodePoster) return;
    
    // 扩展 CodePoster 对象
    Object.assign(CodePoster, {
      // 格式化代码
      formatCode: function() {
        const code = this.elements.codeInput.value;
        const language = this.elements.languageSelect.value;
        let formattedCode = code;
        
        // 根据语言选择格式化方法
        switch (language) {
          case "javascript":
            formattedCode = this.formatJavaScript(code);
            break;
          case "python":
            formattedCode = this.formatPython(code);
            break;
          case "java":
            formattedCode = this.formatJava(code);
            break;
          case "html":
            formattedCode = this.formatHTML(code);
            break;
          case "css":
            formattedCode = this.formatCSS(code);
            break;
        }
        
        // 更新编辑器内容
        this.elements.codeInput.value = formattedCode;
        this.updateLineNumbers();
        this.updateHighlight();
      },
      
      // 简单的JavaScript格式化函数
      formatJavaScript: function(code) {
        let result = "";
        let indentLevel = 0;
        
        for (let i = 0; i < code.length; i++) {
          const char = code[i];
          
          if (char === "{") {
            result += " " + char + "\n" + "  ".repeat(++indentLevel);
          } else if (char === "}") {
            result += "\n" + "  ".repeat(--indentLevel) + char + "\n";
          } else if (char === ";") {
            result += char + "\n" + "  ".repeat(indentLevel);
          } else if (char === "\n") {
            result += "\n" + "  ".repeat(indentLevel);
          } else {
            result += char;
          }
        }
        
        return result;
      },
      
      // 简单的Java格式化函数
      formatJava: function(code) {
        return this.formatJavaScript(code); // 使用JavaScript格式化函数作为基础
      },
      
      // 简单的Python格式化函数
      formatPython: function(code) {
        let result = "";
        let lines = code.split("\n");
        
        for (let i = 0; i < lines.length; i++) {
          let line = lines[i].trim();
          let indentLevel = 0;
          
          // 计算缩进级别
          for (let j = 0; j < i; j++) {
            if (lines[j].trim().endsWith(":")) {
              indentLevel++;
            }
            if (
              lines[j].trim() === "" &&
              j > 0 &&
              !lines[j - 1].trim().endsWith(":")
            ) {
              indentLevel--;
            }
          }
          
          if (line.length > 0) {
            result += "  ".repeat(Math.max(0, indentLevel)) + line + "\n";
          } else {
            result += "\n";
          }
        }
        
        return result;
      },
      
      // 简单的HTML格式化函数
      formatHTML: function(code) {
        // 简单实现，可以根据需要扩展
        return code;
      },
      
      // 简单的CSS格式化函数
      formatCSS: function(code) {
        // 简单实现，可以根据需要扩展
        return code;
      }
    });
    
    // 格式化按钮事件
    CodePoster.elements.formatBtn.addEventListener("click", function() {
      CodePoster.formatCode();
    });
    
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
        
        CodePoster.updateLineNumbers();
        CodePoster.updateHighlight();
      }
    });
  }, 100);
});