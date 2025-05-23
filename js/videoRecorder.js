// 视频录制功能
function setupVideoRecording() {
  console.log("设置视频录制功能");
  
  // 确保 CodePoster 对象存在
  if (!window.CodePoster) {
    console.error("CodePoster 对象未定义");
    return;
  }
  
  // 确保按钮元素存在
  if (!CodePoster.elements.recordVideoBtn) {
    console.error("未找到视频录制按钮");
    return;
  }
  
  // 确保录制指示器元素存在
  if (!CodePoster.elements.recordingIndicator) {
    console.error("未找到录制指示器");
    // 尝试查找录制指示器
    CodePoster.elements.recordingIndicator = document.getElementById("recording-indicator");
    if (!CodePoster.elements.recordingIndicator) {
      console.error("无法找到录制指示器元素");
    } else {
      console.log("已找到录制指示器元素");
    }
  }
  
  // ... existing code ...
  
  // 创建悬浮控制面板
  const floatingPanel = document.createElement("div");
  floatingPanel.className = "floating-control-panel";
  floatingPanel.style.position = "fixed";
  floatingPanel.style.left = "0";
  floatingPanel.style.bottom = "0";
  floatingPanel.style.width = "100%";
  floatingPanel.style.backgroundColor = "#2d2d2d";
  floatingPanel.style.border = "1px solid #444";
  floatingPanel.style.borderBottom = "none";
  floatingPanel.style.borderRadius = "5px 5px 0 0";
  floatingPanel.style.padding = "10px";
  floatingPanel.style.boxShadow = "0 -2px 10px rgba(0, 0, 0, 0.3)";
  floatingPanel.style.zIndex = "1000";
  floatingPanel.style.transition = "transform 0.3s ease";
  floatingPanel.style.display = "flex";
  floatingPanel.style.alignItems = "center";
  floatingPanel.style.justifyContent = "center";
  
  // 创建收起/展开按钮
  const toggleButton = document.createElement("button");
  toggleButton.className = "toggle-panel-btn";
  toggleButton.innerHTML = "▼";
  toggleButton.style.position = "absolute";
  toggleButton.style.right = "10px";
  toggleButton.style.top = "-25px";
  toggleButton.style.width = "30px";
  toggleButton.style.height = "25px";
  toggleButton.style.backgroundColor = "#2d2d2d";
  toggleButton.style.border = "1px solid #444";
  toggleButton.style.borderBottom = "none";
  toggleButton.style.borderRadius = "5px 5px 0 0";
  toggleButton.style.cursor = "pointer";
  toggleButton.style.color = "#ccc";
  toggleButton.style.fontSize = "12px";
  toggleButton.style.display = "flex";
  toggleButton.style.alignItems = "center";
  toggleButton.style.justifyContent = "center";
  
  // 创建录制按钮容器
  const recordBtnContainer = document.createElement("div");
  recordBtnContainer.style.display = "flex";
  recordBtnContainer.style.alignItems = "center";
  recordBtnContainer.style.marginRight = "20px";
  
  // 克隆原始录制按钮
  const newRecordBtn = document.createElement("button");
  newRecordBtn.id = "floating-record-video-btn";
  newRecordBtn.className = "btn";
  newRecordBtn.innerHTML = CodePoster.elements.recordVideoBtn.innerHTML;
  newRecordBtn.style.backgroundColor = "#4caf50";
  
  // 创建取消录制按钮
  const cancelRecordBtn = document.createElement("button");
  cancelRecordBtn.id = "cancel-record-btn";
  cancelRecordBtn.className = "btn";
  cancelRecordBtn.innerHTML = `
    <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="8" y1="8" x2="16" y2="16"></line>
      <line x1="8" y1="16" x2="16" y2="8"></line>
    </svg>
    取消录制
  `;
  cancelRecordBtn.style.backgroundColor = "#d32f2f";
  cancelRecordBtn.style.display = "none";
  
  recordBtnContainer.appendChild(newRecordBtn);
  recordBtnContainer.appendChild(cancelRecordBtn);
  
  // 创建速度设置控件
  const speedControlContainer = document.createElement("div");
  speedControlContainer.className = "speed-control";
  speedControlContainer.style.display = "flex";
  speedControlContainer.style.alignItems = "center";
  speedControlContainer.style.marginRight = "20px";
  
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
  speedUnit.textContent = "ms";
  speedUnit.style.marginLeft = "3px";
  speedUnit.style.fontSize = "12px";
  speedUnit.style.color = "#ccc";
  
  speedControlContainer.appendChild(speedLabel);
  speedControlContainer.appendChild(speedInput);
  speedControlContainer.appendChild(speedUnit);
  
  // 创建编辑器高度设置控件
  const heightControlContainer = document.createElement("div");
  heightControlContainer.className = "height-control";
  heightControlContainer.style.display = "flex";
  heightControlContainer.style.alignItems = "center";
  
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
  
  heightControlContainer.appendChild(heightLabel);
  heightControlContainer.appendChild(heightInput);
  heightControlContainer.appendChild(heightUnit);
  
  // 组装控制面板
  floatingPanel.appendChild(recordBtnContainer);
  floatingPanel.appendChild(speedControlContainer);
  floatingPanel.appendChild(heightControlContainer);
  floatingPanel.appendChild(toggleButton);
  
  // 添加到文档
  document.body.appendChild(floatingPanel);
  
  // 收起/展开功能
  let isPanelCollapsed = false;
  toggleButton.addEventListener("click", function() {
    if (isPanelCollapsed) {
      // 展开面板
      floatingPanel.style.transform = "translateY(0)";
      toggleButton.innerHTML = "▼";
      isPanelCollapsed = false;
    } else {
      // 收起面板
      floatingPanel.style.transform = "translateY(100%)";
      toggleButton.innerHTML = "▲";
      isPanelCollapsed = true;
    }
  });
  
  // 速度输入事件
  speedInput.addEventListener("input", function() {
    // 限制输入范围
    if (parseInt(this.value) < 10) this.value = 10;
    if (parseInt(this.value) > 500) this.value = 500;
    
    // 保存速度设置到全局状态
    if (!CodePoster.state.typingSpeed) {
      CodePoster.state.typingSpeed = {};
    }
    CodePoster.state.typingSpeed.value = parseInt(this.value);
  });
  
  // 高度输入事件
  heightInput.addEventListener("input", function() {
    // 限制输入范围
    if (parseInt(this.value) < 0) this.value = 0;
    if (parseInt(this.value) > 1000) this.value = 1000;
    
    // 保存高度设置到全局状态
    if (!CodePoster.state.editorHeight) {
      CodePoster.state.editorHeight = {};
    }
    CodePoster.state.editorHeight.value = parseInt(this.value);
    
    // 应用编辑器高度
    if (typeof window.applyEditorHeight === 'function') {
      window.applyEditorHeight();
    }
  });
  
  // 模拟打字效果函数（如果 typingSimulator.js 未加载）
  if (!window.simulateTyping) {
    window.simulateTyping = function(text, speed = null) {
      return new Promise((resolve) => {
        const typingSpeed = speed || (CodePoster.state.typingSpeed ? CodePoster.state.typingSpeed.value : 50);
        const originalCode = CodePoster.elements.codeInput.value;
        CodePoster.elements.codeInput.value = '';
        
        const inputEvent = new Event('input', { bubbles: true });
        CodePoster.elements.codeInput.dispatchEvent(inputEvent);
        
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
    };
  }
  
  // 初始化状态对象
  if (!CodePoster.state) {
    CodePoster.state = {};
  }
  
  // 初始化录制状态
  if (CodePoster.state.isRecording === undefined) {
    CodePoster.state.isRecording = false;
  }
  
  // 录制视频按钮点击事件
  newRecordBtn.addEventListener("click", async function() {
    console.log("视频录制按钮被点击");
    try {
      // 检查浏览器支持
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        alert("您的浏览器不支持屏幕录制功能。请使用最新版本的Chrome或Firefox浏览器。");
        return;
      }
      
      // 获取原始代码
      const originalCode = CodePoster.elements.codeInput.value;
      
      // 请求屏幕共享
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always"
        },
        audio: false
      });
      
      // 创建MediaRecorder实例
      CodePoster.state.recordedChunks = [];
      CodePoster.state.mediaRecorder = new MediaRecorder(stream);
      
      // 数据可用时的处理
      CodePoster.state.mediaRecorder.ondataavailable = function(e) {
        console.log("录制数据可用");
        if (e.data.size > 0) {
          CodePoster.state.recordedChunks.push(e.data);
        }
      };
      
      // 录制停止时的处理
      CodePoster.state.mediaRecorder.onstop = function() {
        console.log("录制停止");
        // 只有在有录制内容时才处理
        if (CodePoster.state.recordedChunks && CodePoster.state.recordedChunks.length > 0) {
          console.log("处理录制内容");
          // 创建视频Blob
          const blob = new Blob(CodePoster.state.recordedChunks, {
            type: "video/webm"
          });
          
          // 显示录制的视频
          const videoURL = URL.createObjectURL(blob);
          const video = document.createElement("video");
          video.src = videoURL;
          video.controls = true;
          video.style.maxWidth = "100%";
          
          if (CodePoster.elements.videoContainer) {
            CodePoster.elements.videoContainer.innerHTML = "";
            CodePoster.elements.videoContainer.appendChild(video);
            
            // 显示视频模态框
            if (CodePoster.elements.videoModal) {
              CodePoster.elements.videoModal.style.display = "flex";
            }
            
            // 下载视频按钮事件
            if (CodePoster.elements.downloadVideoBtn) {
              CodePoster.elements.downloadVideoBtn.onclick = function() {
                const a = document.createElement("a");
                a.href = videoURL;
                a.download = `code-recording-${new Date().getTime()}.webm`;
                a.click();
              };
            }
          }
        }
        
        // 停止所有轨道
        stream.getTracks().forEach(track => track.stop());
        
        // 重置录制状态
        CodePoster.state.isRecording = false;
        
        // 更新录制指示器状态
        if (CodePoster.elements.recordingIndicator) {
          CodePoster.elements.recordingIndicator.classList.remove("active");
        }
        
        // 恢复录制按钮显示
        newRecordBtn.style.display = "inline-flex";
        
        // 隐藏取消录制按钮
        cancelRecordBtn.style.display = "none";
        
        // 恢复原始代码
        CodePoster.elements.codeInput.value = originalCode;
        const inputEvent = new Event('input', { bubbles: true });
        CodePoster.elements.codeInput.dispatchEvent(inputEvent);
      };
      
      // 开始录制
      CodePoster.state.mediaRecorder.start();
      CodePoster.state.isRecording = true;
      
      // 显示录制指示器
      if (CodePoster.elements.recordingIndicator) {
        console.log("显示录制指示器");
        CodePoster.elements.recordingIndicator.classList.add("active");
      } else {
        console.error("无法显示录制指示器，元素不存在");
      }
      
      // 隐藏录制按钮，显示取消按钮
      this.style.display = "none";
      cancelRecordBtn.style.display = "inline-flex";
      
      // 清空编辑器
      CodePoster.elements.codeInput.value = "";
      const inputEvent = new Event('input', { bubbles: true });
      CodePoster.elements.codeInput.dispatchEvent(inputEvent);
      
      // 使用模拟打字效果
      if (typeof window.simulateTyping === 'function') {
        console.log("开始模拟打字效果");
        await window.simulateTyping(originalCode);
        console.log("模拟打字效果完成");
      }
      
      // 录制完成后自动停止
      console.log("自动停止录制");
      CodePoster.state.mediaRecorder.stop();
      
    } catch (error) {
      console.error("视频录制失败:", error);
      alert("视频录制失败: " + error.message);
    }
  });
  
  // 取消录制按钮点击事件
  cancelRecordBtn.addEventListener("click", function() {
    console.log("取消录制按钮被点击");
    if (CodePoster.state.mediaRecorder && CodePoster.state.isRecording) {
      CodePoster.state.mediaRecorder.stop();
    }
  });
  
  // 原始录制按钮点击事件 - 重定向到新按钮
  CodePoster.elements.recordVideoBtn.addEventListener("click", function() {
    // 触发新按钮的点击事件
    newRecordBtn.click();
  });
  
  // 关闭视频模态框
  if (CodePoster.elements.closeVideoModal) {
    CodePoster.elements.closeVideoModal.addEventListener("click", function() {
      if (CodePoster.elements.videoModal) {
        CodePoster.elements.videoModal.style.display = "none";
      }
    });
  }
  
  // 点击视频模态框背景关闭
  if (CodePoster.elements.videoModal) {
    CodePoster.elements.videoModal.addEventListener("click", function(e) {
      if (e.target === this) {
        this.style.display = "none";
      }
    });
  }
  
  // 隐藏原始工具栏中的控件
  // 这里我们不删除原始按钮，只是隐藏它，因为其他代码可能依赖它
  CodePoster.elements.recordVideoBtn.style.display = "none";
  
  // 查找并隐藏原始工具栏中的其他控件
  const toolbar = CodePoster.elements.recordVideoBtn.parentNode;
  if (toolbar) {
    const speedControl = toolbar.querySelector(".speed-control");
    if (speedControl) speedControl.style.display = "none";
    
    const heightControl = toolbar.querySelector(".height-control");
    if (heightControl) heightControl.style.display = "none";
  }
}

// 在文件末尾添加自动执行代码
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM加载完成，准备设置视频录制功能");
  // 等待核心模块加载完成
  setTimeout(() => {
    setupVideoRecording();
  }, 500); // 增加延迟时间，确保其他模块已加载
});