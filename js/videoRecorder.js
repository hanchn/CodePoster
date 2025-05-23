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
  
  // 确保视频模态框元素存在
  if (!CodePoster.elements.videoModal) {
    console.error("未找到视频模态框");
    // 尝试查找视频模态框
    CodePoster.elements.videoModal = document.getElementById("video-modal");
    if (!CodePoster.elements.videoModal) {
      console.error("无法找到视频模态框元素");
    } else {
      console.log("已找到视频模态框元素");
    }
  }
  
  // 确保视频容器元素存在
  if (!CodePoster.elements.videoContainer) {
    console.error("未找到视频容器");
    // 尝试查找视频容器
    CodePoster.elements.videoContainer = document.getElementById("video-container");
    if (!CodePoster.elements.videoContainer) {
      console.error("无法找到视频容器元素");
    } else {
      console.log("已找到视频容器元素");
    }
  }
  
  // 确保下载视频按钮元素存在
  if (!CodePoster.elements.downloadVideoBtn) {
    console.error("未找到下载视频按钮");
    // 尝试查找下载视频按钮
    CodePoster.elements.downloadVideoBtn = document.getElementById("download-video-btn");
    if (!CodePoster.elements.downloadVideoBtn) {
      console.error("无法找到下载视频按钮元素");
    } else {
      console.log("已找到下载视频按钮元素");
    }
  }
  
  // 确保关闭视频模态框按钮元素存在
  if (!CodePoster.elements.closeVideoModal) {
    console.error("未找到关闭视频模态框按钮");
    // 尝试查找关闭视频模态框按钮
    CodePoster.elements.closeVideoModal = document.getElementById("close-video-modal");
    if (!CodePoster.elements.closeVideoModal) {
      console.error("无法找到关闭视频模态框按钮元素");
    } else {
      console.log("已找到关闭视频模态框按钮元素");
    }
  }
  
  console.log("找到视频录制按钮，开始设置");
  
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
  
  // 将取消按钮添加到工具栏
  CodePoster.elements.recordVideoBtn.parentNode.appendChild(cancelRecordBtn);
  
  // 创建速度设置控件
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
  
  // 创建数字输入框替代滑动条
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
  
  speedControlContainer.appendChild(speedLabel);
  speedControlContainer.appendChild(speedInput);
  speedControlContainer.appendChild(speedUnit);
  
  // 将速度控制添加到工具栏
  CodePoster.elements.recordVideoBtn.parentNode.appendChild(speedControlContainer);
  
  // 创建编辑器高度设置控件
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
  
  heightControlContainer.appendChild(heightLabel);
  heightControlContainer.appendChild(heightInput);
  heightControlContainer.appendChild(heightUnit);
  
  // 将高度控制添加到工具栏
  CodePoster.elements.recordVideoBtn.parentNode.appendChild(heightControlContainer);
  
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
  console.log("添加视频录制按钮点击事件");
  CodePoster.elements.recordVideoBtn.addEventListener("click", async function() {
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
      // 在录制完成的地方触发事件
      CodePoster.state.mediaRecorder.onstop = function() {
        // ... existing code ...
        
        // 触发录制完成事件
        document.dispatchEvent(new Event('recordingComplete'));
        
        // 停止所有轨道
        stream.getTracks().forEach(track => track.stop());
        
        // 重置录制状态
        CodePoster.state.isRecording = false;
        
        // 更新录制指示器状态
        if (CodePoster.elements.recordingIndicator) {
          CodePoster.elements.recordingIndicator.classList.remove("active");
        }
        
        // 恢复录制按钮显示
        CodePoster.elements.recordVideoBtn.style.display = "inline-flex";
        
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
}

// 在文件末尾添加自动执行代码
document.addEventListener("DOMContentLoaded", function() {
  console.log("DOM加载完成，准备设置视频录制功能");
  // 等待核心模块加载完成
  setTimeout(() => {
    setupVideoRecording();
  }, 500); // 增加延迟时间，确保其他模块已加载
});