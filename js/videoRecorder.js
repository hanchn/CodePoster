export function setupVideoRecording() {
  if (!CodePoster.elements.recordVideoBtn) return;

  // 视频录制功能
  // 视频录制功能
  document.addEventListener("DOMContentLoaded", function () {
    // 等待核心模块加载完成
    setTimeout(() => {
      if (!window.CodePoster) return;
      
      // 视频录制功能
      if (CodePoster.elements.recordVideoBtn) {
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
        
        // 录制视频按钮点击事件
        CodePoster.elements.recordVideoBtn.addEventListener("click", async function() {
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
              if (e.data.size > 0) {
                CodePoster.state.recordedChunks.push(e.data);
              }
            };
            
            // 录制停止时的处理
            CodePoster.state.mediaRecorder.onstop = function() {
              // 只有在有录制内容时才处理
              if (CodePoster.state.recordedChunks.length > 0) {
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
                
                CodePoster.elements.videoContainer.innerHTML = "";
                CodePoster.elements.videoContainer.appendChild(video);
                
                // 显示视频模态框
                CodePoster.elements.videoModal.style.display = "flex";
                
                // 下载视频按钮事件
                CodePoster.elements.downloadVideoBtn.onclick = function() {
                  const a = document.createElement("a");
                  a.href = videoURL;
                  a.download = `code-recording-${new Date().getTime()}.webm`;
                  a.click();
                };
              }
              
              // 停止所有轨道
              stream.getTracks().forEach(track => track.stop());
              
              // 重置录制状态
              CodePoster.state.isRecording = false;
              CodePoster.elements.recordingIndicator.classList.remove("active");
              CodePoster.elements.recordVideoBtn.style.display = "inline-flex";
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
            CodePoster.elements.recordingIndicator.classList.add("active");
            
            // 隐藏录制按钮，显示取消按钮
            this.style.display = "none";
            cancelRecordBtn.style.display = "inline-flex";
            
            // 清空编辑器
            CodePoster.elements.codeInput.value = "";
            const inputEvent = new Event('input', { bubbles: true });
            CodePoster.elements.codeInput.dispatchEvent(inputEvent);
            
            // 使用模拟打字效果
            if (typeof window.simulateTyping === 'function') {
              await window.simulateTyping(originalCode);
            }
            
            // 录制完成后自动停止
            CodePoster.state.mediaRecorder.stop();
            
          } catch (error) {
            console.error("视频录制失败:", error);
            alert("视频录制失败: " + error.message);
          }
        });
        
        // 取消录制按钮点击事件
        cancelRecordBtn.addEventListener("click", function() {
          if (CodePoster.state.mediaRecorder && CodePoster.state.isRecording) {
            CodePoster.state.mediaRecorder.stop();
          }
        });
        
        // 关闭视频模态框
        CodePoster.elements.closeVideoModal.addEventListener("click", function() {
          CodePoster.elements.videoModal.style.display = "none";
        });
        
        // 点击视频模态框背景关闭
        CodePoster.elements.videoModal.addEventListener("click", function(e) {
          if (e.target === this) {
            this.style.display = "none";
          }
        });
      } else {
        console.error("未找到视频录制按钮");
      }
    }, 100);
  });
}

// 修改工具栏位置为侧边
const toolbar = document.createElement("div");
toolbar.className = "code-toolbar";
toolbar.style.position = "absolute";
toolbar.style.left = "0";
toolbar.style.top = "0";
toolbar.style.width = "60px";
toolbar.style.height = "100%";
toolbar.style.backgroundColor = "#2a2a2a";
toolbar.style.display = "flex";
toolbar.style.flexDirection = "column";
toolbar.style.alignItems = "center";
toolbar.style.padding = "10px 0";
toolbar.style.zIndex = "100";

// 将按钮添加到侧边工具栏
CodePoster.elements.editorContainer.appendChild(toolbar);
toolbar.appendChild(CodePoster.elements.recordVideoBtn);
toolbar.appendChild(speedControlContainer); 
toolbar.appendChild(heightControlContainer);

// 修改编辑器样式，移除不必要元素
CodePoster.elements.editorContainer.style.paddingLeft = "80px"; // 为侧边栏留出空间
CodePoster.elements.codeDisplay.style.width = "100%";
CodePoster.elements.codeDisplay.style.height = "100%";
CodePoster.elements.codeInput.style.display = "none"; // 隐藏输入区域
CodePoster.elements.lineNumbers.style.display = "none"; // 隐藏行号

// 确保编辑器只显示代码展示部分
CodePoster.elements.codeDisplay.style.overflow = "auto";
CodePoster.elements.codeDisplay.style.whiteSpace = "pre-wrap";
CodePoster.elements.codeDisplay.style.wordWrap = "break-word";
CodePoster.elements.codeDisplay.style.padding = "20px";
CodePoster.elements.codeDisplay.style.boxSizing = "border-box";