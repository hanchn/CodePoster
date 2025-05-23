export function setupVideoRecording() {
  if (!CodePoster.elements.recordVideoBtn) return;

  // 创建取消录制按钮
  const cancelRecordBtn = document.createElement("button");
  cancelRecordBtn.textContent = "取消录制";
  cancelRecordBtn.className = "record-btn cancel";
  cancelRecordBtn.style.display = "none";
  cancelRecordBtn.style.marginLeft = "10px";
  
  // 将取消按钮添加到工具栏
  CodePoster.elements.recordVideoBtn.parentNode.appendChild(cancelRecordBtn);

  // 速度控制设置
  const speedControlContainer = document.createElement("div");
  speedControlContainer.className = "speed-control";
  speedControlContainer.style.display = "inline-flex";
  speedControlContainer.style.alignItems = "center";
  speedControlContainer.style.marginLeft = "10px";
  
  const speedLabel = document.createElement("label");
  speedLabel.textContent = "打字速度: ";
  speedLabel.style.marginRight = "5px";
  speedLabel.style.fontSize = "12px";
  speedLabel.style.color = "#ccc";
  
  const speedInput = document.createElement("input");
  speedInput.type = "number";
  speedInput.min = "10";
  speedInput.max = "500";
  speedInput.value = "50";
  speedInput.style.width = "50px";
  speedInput.style.backgroundColor = "#333";
  speedInput.style.color = "#ccc";
  speedInput.style.border = "1px solid #555";
  speedInput.style.borderRadius = "3px";
  speedInput.style.padding = "2px 5px";
  speedInput.style.fontSize = "12px";
  
  const speedUnit = document.createElement("span");
  speedUnit.textContent = "ms/字符";
  speedUnit.style.marginLeft = "3px";
  speedUnit.style.fontSize = "12px";
  speedUnit.style.color = "#ccc";
  
  speedInput.addEventListener("input", function() {
    if (parseInt(this.value) < 10) this.value = 10;
    if (parseInt(this.value) > 500) this.value = 500;
    
    if (!CodePoster.state.typingSpeed) {
      CodePoster.state.typingSpeed = {};
    }
    CodePoster.state.typingSpeed.value = parseInt(this.value);
  });
  
  speedControlContainer.appendChild(speedLabel);
  speedControlContainer.appendChild(speedInput);
  speedControlContainer.appendChild(speedUnit);
  
  // 将速度控制添加到工具栏
  CodePoster.elements.recordVideoBtn.parentNode.appendChild(speedControlContainer);
  
  // 高度控制设置
  const heightControlContainer = document.createElement("div");
  heightControlContainer.className = "height-control";
  heightControlContainer.style.display = "inline-flex";
  heightControlContainer.style.alignItems = "center";
  heightControlContainer.style.marginLeft = "10px";
  
  const heightLabel = document.createElement("label");
  heightLabel.textContent = "编辑器高度: ";
  heightLabel.style.marginRight = "5px";
  heightLabel.style.fontSize = "12px";
  heightLabel.style.color = "#ccc";
  
  const heightInput = document.createElement("input");
  heightInput.type = "number";
  heightInput.min = "0";
  heightInput.max = "1000";
  heightInput.value = "0";
  heightInput.style.width = "50px";
  heightInput.style.backgroundColor = "#333";
  heightInput.style.color = "#ccc";
  heightInput.style.border = "1px solid #555";
  heightInput.style.borderRadius = "3px";
  heightInput.style.padding = "2px 5px";
  heightInput.style.fontSize = "12px";
  
  const heightUnit = document.createElement("span");
  heightUnit.textContent = "px";
  heightUnit.style.marginLeft = "3px";
  heightUnit.style.fontSize = "12px";
  heightUnit.style.color = "#ccc";
  
  heightInput.addEventListener("input", function() {
    if (parseInt(this.value) < 0) this.value = 0;
    if (parseInt(this.value) > 1000) this.value = 1000;
    
    if (!CodePoster.state.editorHeight) {
      CodePoster.state.editorHeight = {};
    }
    CodePoster.state.editorHeight.value = parseInt(this.value);
    applyEditorHeight();
  });
  
  heightControlContainer.appendChild(heightLabel);
  heightControlContainer.appendChild(heightInput);
  heightControlContainer.appendChild(heightUnit);
  
  // 将高度控制添加到工具栏
  CodePoster.elements.recordVideoBtn.parentNode.appendChild(heightControlContainer);
  
  // 设置默认打字速度
  if (!CodePoster.state.typingSpeed) {
    CodePoster.state.typingSpeed = { value: 50 };
  }
  
  // 设置默认编辑器高度
  if (!CodePoster.state.editorHeight) {
    CodePoster.state.editorHeight = { value: 0 };
  }
  
  // 应用编辑器高度设置函数
  function applyEditorHeight() {
    const height = CodePoster.state.editorHeight.value;
    const editorContainer = CodePoster.elements.editorContainer;
    
    editorContainer.style.display = 'flex';
    editorContainer.style.width = '100%';
    editorContainer.style.position = 'relative';
    
    CodePoster.elements.lineNumbers.style.overflowY = 'hidden';
    CodePoster.elements.lineNumbers.style.flexShrink = '0';
    CodePoster.elements.lineNumbers.style.borderRight = '1px solid #444';
    
    if (height > 0) {
      editorContainer.style.height = height + 'px';
      CodePoster.elements.codeInput.style.height = '100%';
      CodePoster.elements.codeDisplay.style.height = '100%';
      CodePoster.elements.lineNumbers.style.height = '100%';
      CodePoster.elements.codeInput.style.overflowY = 'auto';
      CodePoster.elements.codeInput.style.overflowX = 'hidden';
      CodePoster.elements.codeDisplay.style.overflowY = 'auto';
      CodePoster.elements.codeDisplay.style.overflowX = 'hidden';
    } else {
      editorContainer.style.height = 'auto';
      CodePoster.elements.codeInput.style.height = 'auto';
      CodePoster.elements.codeDisplay.style.height = 'auto';
      CodePoster.elements.lineNumbers.style.height = 'auto';
      CodePoster.elements.codeInput.style.minHeight = '200px';
      CodePoster.elements.codeDisplay.style.minHeight = '200px';
      CodePoster.elements.lineNumbers.style.minHeight = '200px';
      CodePoster.elements.codeInput.style.overflowY = 'auto';
      CodePoster.elements.codeInput.style.overflowX = 'hidden';
      CodePoster.elements.codeDisplay.style.overflowY = 'auto';
      CodePoster.elements.codeDisplay.style.overflowX = 'hidden';
    }
    
    const textStyles = {
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      wordBreak: 'normal',
      width: '100%',
      boxSizing: 'border-box',
      padding: '10px',
      lineHeight: '1.5',
      tabSize: '2'
    };
    
    Object.assign(CodePoster.elements.codeInput.style, textStyles);
    Object.assign(CodePoster.elements.codeDisplay.style, textStyles);
    
    const scrollbarStyle = `
      ::-webkit-scrollbar {
        width: 8px;
        height: 0px;
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
    
    if (!document.getElementById('scrollbar-style')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'scrollbar-style';
      styleEl.textContent = scrollbarStyle;
      document.head.appendChild(styleEl);
    }
    
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 10);
  }
  
  // 修改录制指示器样式
  CodePoster.elements.recordingIndicator.style.position = "fixed";
  CodePoster.elements.recordingIndicator.style.top = "10px";
  CodePoster.elements.recordingIndicator.style.right = "10px";
  CodePoster.elements.recordingIndicator.style.zIndex = "9999";
  
  // 设置编辑器自动换行
  CodePoster.elements.codeInput.style.whiteSpace = "pre-wrap";
  CodePoster.elements.codeInput.style.wordWrap = "break-word";
  CodePoster.elements.codeInput.style.wordBreak = "break-all";
  CodePoster.elements.codeInput.style.width = "100%";
  CodePoster.elements.codeInput.style.boxSizing = "border-box";
  
  CodePoster.elements.codeDisplay.style.whiteSpace = "pre-wrap";
  CodePoster.elements.codeDisplay.style.wordWrap = "break-word";
  CodePoster.elements.codeDisplay.style.wordBreak = "break-all";
  CodePoster.elements.codeDisplay.style.width = "100%";
  CodePoster.elements.codeDisplay.style.boxSizing = "border-box";
  
  // 初始应用编辑器高度设置
  applyEditorHeight();
  
  // 模拟打字效果函数
  function simulateTyping(text, speed = null) {
    return new Promise((resolve) => {
      const typingSpeed = speed || (CodePoster.state.typingSpeed ? CodePoster.state.typingSpeed.value : 50);
      const originalCode = CodePoster.elements.codeInput.value;
      CodePoster.elements.codeInput.value = '';
      
      const inputEvent = new Event('input', { bubbles: true });
      CodePoster.elements.codeInput.dispatchEvent(inputEvent);
      applyEditorHeight();
      
      let i = 0;
      
      function typeChar() {
        if (i < text.length) {
          CodePoster.elements.codeInput.value += text.charAt(i);
          i++;
          CodePoster.elements.codeInput.dispatchEvent(inputEvent);
          CodePoster.elements.codeInput.scrollTop = CodePoster.elements.codeInput.scrollHeight;
          
          if (CodePoster.elements.codeDisplay) {
            CodePoster.elements.codeDisplay.scrollTop = CodePoster.elements.codeDisplay.scrollHeight;
          }
          
          if (CodePoster.elements.lineNumbers) {
            CodePoster.elements.lineNumbers.scrollTop = CodePoster.elements.lineNumbers.scrollHeight;
          }
          
          const randomDelay = typingSpeed + Math.random() * (typingSpeed * 0.5);
          setTimeout(typeChar, randomDelay);
        } else {
          resolve();
        }
      }
      
      typeChar();
    });
  }
  
  // 录制按钮点击事件
  CodePoster.elements.recordVideoBtn.addEventListener("click", async function () {
    try {
      if (!CodePoster.state.isRecording) {
        const originalCode = CodePoster.elements.codeInput.value;
        const currentLanguage = CodePoster.elements.languageSelect.value;
        const typingSpeed = CodePoster.state.typingSpeed ? CodePoster.state.typingSpeed.value : 50;
        
        alert("请在下一步中选择要录制的区域（建议选择当前浏览器窗口）");
        
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            cursor: "always",
            displaySurface: "window"
          },
          audio: false
        });
        
        if (!stream) return;
        
        CodePoster.state.mediaRecorder = new MediaRecorder(stream);
        CodePoster.state.recordedChunks = [];
        
        CodePoster.state.mediaRecorder.ondataavailable = function(e) {
          if (e.data.size > 0) {
            CodePoster.state.recordedChunks.push(e.data);
          }
        };
        
        CodePoster.state.mediaRecorder.onstop = function() {
          if (CodePoster.state.recordedChunks.length > 0) {
            const blob = new Blob(CodePoster.state.recordedChunks, {
              type: "video/webm"
            });
            
            const videoURL = URL.createObjectURL(blob);
            const video = document.createElement("video");
            video.src = videoURL;
            video.controls = true;
            video.style.maxWidth = "100%";
            
            CodePoster.elements.videoContainer.innerHTML = "";
            CodePoster.elements.videoContainer.appendChild(video);
            CodePoster.elements.videoModal.style.display = "flex";
            
            CodePoster.elements.downloadVideoBtn.onclick = function() {
              const a = document.createElement("a");
              a.href = videoURL;
              a.download = `code-recording-${new Date().getTime()}.webm`;
              a.click();
            };
          }
          
          stream.getTracks().forEach(track => track.stop());
          CodePoster.state.isRecording = false;
          CodePoster.elements.recordingIndicator.classList.remove("active");
          CodePoster.elements.recordVideoBtn.style.display = "inline-flex";
          cancelRecordBtn.style.display = "none";
          
          CodePoster.elements.codeInput.value = originalCode;
          const inputEvent = new Event('input', { bubbles: true });
          CodePoster.elements.codeInput.dispatchEvent(inputEvent);
        };
        
        CodePoster.state.mediaRecorder.start();
        CodePoster.state.isRecording = true;
        CodePoster.elements.recordingIndicator.classList.add("active");
        this.style.display = "none";
        cancelRecordBtn.style.display = "inline-flex";
        
        // 开始模拟打字
        await simulateTyping(originalCode, typingSpeed);
        
        // 停止录制
        CodePoster.state.mediaRecorder.stop();
      }
    } catch (error) {
      console.error("录制失败:", error);
      alert("录制过程中出错: " + error.message);
      
      if (CodePoster.state.mediaRecorder && CodePoster.state.mediaRecorder.state !== "inactive") {
        CodePoster.state.mediaRecorder.stop();
      }
      
      CodePoster.state.isRecording = false;
      CodePoster.elements.recordingIndicator.classList.remove("active");
      CodePoster.elements.recordVideoBtn.style.display = "inline-flex";
      cancelRecordBtn.style.display = "none";
    }
  });
  
  // 取消录制按钮事件
  cancelRecordBtn.addEventListener("click", function() {
    if (CodePoster.state.mediaRecorder && CodePoster.state.mediaRecorder.state !== "inactive") {
      CodePoster.state.mediaRecorder.stop();
    }
    
    CodePoster.state.isRecording = false;
    CodePoster.elements.recordingIndicator.classList.remove("active");
    CodePoster.elements.recordVideoBtn.style.display = "inline-flex";
    this.style.display = "none";
  });
}