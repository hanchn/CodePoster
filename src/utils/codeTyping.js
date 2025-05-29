/**
 * 代码自动输出工具
 * 模拟人工输入代码的效果
 */
export class CodeTypingEffect {
  constructor(editor, options = {}) {
    this.editor = editor
    this.options = {
      typingSpeed: 50, // 打字速度（毫秒）
      pauseOnNewLine: 200, // 换行时的暂停时间
      pauseOnSpecialChar: 100, // 特殊字符的暂停时间
      ...options
    }
    this.isTyping = false
    this.currentIndex = 0
    this.targetCode = ''
  }

  // 开始自动输入代码
  async startTyping(code) {
    if (this.isTyping) return
    
    this.isTyping = true
    this.targetCode = code
    this.currentIndex = 0
    
    // 清空编辑器
    this.editor.setValue('')
    
    return new Promise((resolve) => {
      this.typeNextCharacter(resolve)
    })
  }

  // 输入下一个字符
  typeNextCharacter(resolve) {
    if (this.currentIndex >= this.targetCode.length || !this.isTyping) {
      this.isTyping = false
      resolve()
      return
    }

    const char = this.targetCode[this.currentIndex]
    const currentValue = this.editor.getValue()
    
    // 更新编辑器内容
    this.editor.setValue(currentValue + char)
    
    // 移动光标到末尾
    const model = this.editor.getModel()
    const lineCount = model.getLineCount()
    const lastLineLength = model.getLineLength(lineCount)
    this.editor.setPosition({ lineNumber: lineCount, column: lastLineLength + 1 })
    
    this.currentIndex++
    
    // 计算下一个字符的延迟时间
    let delay = this.options.typingSpeed
    if (char === '\n') {
      delay = this.options.pauseOnNewLine
    } else if (/[{}();,.]/.test(char)) {
      delay = this.options.pauseOnSpecialChar
    }
    
    // 添加随机延迟，使效果更自然
    delay += Math.random() * 30
    
    setTimeout(() => {
      this.typeNextCharacter(resolve)
    }, delay)
  }

  // 停止输入
  stopTyping() {
    this.isTyping = false
  }

  // 设置输入速度
  setTypingSpeed(speed) {
    this.options.typingSpeed = speed
  }
}