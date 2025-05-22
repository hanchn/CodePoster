// 图片和视频生成功能
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块加载完成
  setTimeout(() => {
    if (!window.CodePoster) return;
    
    // 生成图片功能
    if (CodePoster.elements.generateImageBtn) {
      CodePoster.elements.generateImageBtn.addEventListener("click", async function () {
        try {
          console.log("生成图片按钮被点击");
          
          // 创建一个更简单的临时容器
          const tempContainer = document.createElement("div");
          tempContainer.style.position = "fixed";
          tempContainer.style.left = "0";
          tempContainer.style.top = "0";
          tempContainer.style.width = CodePoster.elements.editorContainer.offsetWidth + "px";
          tempContainer.style.height = (CodePoster.elements.editorContainer.offsetHeight - document.querySelector(".toolbar").offsetHeight) + "px";
          tempContainer.style.backgroundColor = "#1e1e1e";
          tempContainer.style.display = "flex";
          tempContainer.style.zIndex = "-1000"; // 确保不可见
          
          // 克隆行号区域
          const lineNumbersClone = CodePoster.elements.lineNumbers.cloneNode(true);
          tempContainer.appendChild(lineNumbersClone);
          
          // 克隆代码显示区域
          const codeAreaClone = document.createElement("div");
          codeAreaClone.style.flex = "1";
          codeAreaClone.style.backgroundColor = "#252526";
          codeAreaClone.style.padding = "10px";
          codeAreaClone.innerHTML = CodePoster.elements.codeDisplay.innerHTML;
          tempContainer.appendChild(codeAreaClone);
          
          // 将临时容器添加到文档中
          document.body.appendChild(tempContainer);
          
          // 使用更简单的html2canvas配置
          console.log("开始生成图片");
          const canvas = await html2canvas(tempContainer, {
            backgroundColor: "#1e1e1e",
            scale: 2,
            logging: false,
            useCORS: true
          });
          
          console.log("图片生成完成");
          
          // 显示生成的图片
          CodePoster.elements.imageContainer.innerHTML = "";
          const img = document.createElement("img");
          CodePoster.state.generatedImageUrl = canvas.toDataURL("image/png");
          img.src = CodePoster.state.generatedImageUrl;
          img.style.maxWidth = "100%";
          CodePoster.elements.imageContainer.appendChild(img);
          
          // 显示模态框
          CodePoster.elements.imageModal.style.display = "flex";
          
          // 移除临时容器
          document.body.removeChild(tempContainer);
        } catch (error) {
          console.error("生成图片失败:", error);
          alert("生成图片失败: " + error.message);
        }
      });
    } else {
      console.error("未找到生成图片按钮");
    }
    
    // 下载图片
    CodePoster.elements.downloadBtn.addEventListener("click", function () {
      if (CodePoster.state.generatedImageUrl) {
        const link = document.createElement("a");
        link.href = CodePoster.state.generatedImageUrl;
        link.download = `code-editor-${
          CodePoster.elements.languageSelect.value
        }-${new Date().getTime()}.png`;
        link.click();
      }
    });
    
    // 关闭图片模态框
    CodePoster.elements.closeModal.addEventListener("click", function () {
      CodePoster.elements.imageModal.style.display = "none";
    });
    
    // 点击图片模态框背景关闭
    CodePoster.elements.imageModal.addEventListener("click", function (e) {
      if (e.target === this) {
        this.style.display = "none";
      }
    });
    
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
      
      // 修改录制指示器样式，使其不被录制
      CodePoster.elements.recordingIndicator.style.position = "fixed";
      CodePoster.elements.recordingIndicator.style.top = "10px";
      CodePoster.elements.recordingIndicator.style.right = "10px";
      CodePoster.elements.recordingIndicator.style.zIndex = "9999";
      
      // 模拟打字效果函数
      function simulateTyping(text, element, speed = 50) {
        return new Promise((resolve) => {
          let i = 0;
          element.value = '';
          
          function typeChar() {
            if (i < text.length) {
              element.value += text.charAt(i);
              i++;
              // 触发input事件以更新高亮和行号
              const event = new Event('input', { bubbles: true });
              element.dispatchEvent(event);
              
              // 随机化打字速度，使其更像人工输入
              const randomDelay = speed + Math.random() * 100;
              setTimeout(typeChar, randomDelay);
            } else {
              resolve();
            }
          }
          
          typeChar();
        });
      }
      
      // 创建一个专门用于录制的视图
      function createRecordingView() {
        // 创建一个新的容器
        const recordingView = document.createElement("div");
        recordingView.id = "recording-view";
        recordingView.style.position = "fixed";
        recordingView.style.top = "0";
        recordingView.style.left = "0";
        recordingView.style.width = "100%";
        recordingView.style.height = "100%";
        recordingView.style.backgroundColor = "#1e1e1e";
        recordingView.style.zIndex = "9998";
        recordingView.style.display = "flex";
        recordingView.style.flexDirection = "column";
        recordingView.style.alignItems = "center";
        recordingView.style.justifyContent = "center";
        recordingView.style.padding = "20px";
        
        // 创建代码显示区域
        const codeArea = document.createElement("div");
        codeArea.style.width = "80%";
        codeArea.style.maxWidth = "1000px";
        codeArea.style.display = "flex";
        codeArea.style.backgroundColor = "#252526";
        codeArea.style.borderRadius = "8px";
        codeArea.style.overflow = "hidden";
        codeArea.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.5)";
        
        // 创建行号区域
        const lineNumbersClone = document.createElement("div");
        lineNumbersClone.style.width = "60px";
        lineNumbersClone.style.backgroundColor = "#1e1e1e";
        lineNumbersClone.style.color = "#858585";
        lineNumbersClone.style.textAlign = "right";
        lineNumbersClone.style.padding = "10px 0";
        lineNumbersClone.style.userSelect = "none";
        lineNumbersClone.style.fontFamily = "Menlo, Monaco, 'Courier New', monospace";
        lineNumbersClone.style.fontSize = CodePoster.elements.lineNumbers.style.fontSize || "14px";
        lineNumbersClone.style.lineHeight = CodePoster.elements.lineNumbers.style.lineHeight || "20px";
        lineNumbersClone.innerHTML = CodePoster.elements.lineNumbers.innerHTML;
        
        // 创建代码显示区域
        const codeDisplayClone = document.createElement("div");
        codeDisplayClone.style.flex = "1";
        codeDisplayClone.style.padding = "10px";
        codeDisplayClone.style.backgroundColor = "#252526";
        codeDisplayClone.style.color = "#d4d4d4";
        codeDisplayClone.style.fontFamily = "Menlo, Monaco, 'Courier New', monospace";
        codeDisplayClone.style.fontSize = CodePoster.elements.codeDisplay.style.fontSize || "14px";
        codeDisplayClone.style.lineHeight = CodePoster.elements.codeDisplay.style.lineHeight || "20px";
        codeDisplayClone.style.whiteSpace = CodePoster.elements.codeDisplay.style.whiteSpace || "pre";
        codeDisplayClone.style.overflow = "auto";
        codeDisplayClone.id = "recording-code-display";
        
        // 添加到容器中
        codeArea.appendChild(lineNumbersClone);
        codeArea.appendChild(codeDisplayClone);
        recordingView.appendChild(codeArea);
        
        return {
          view: recordingView,
          lineNumbers: lineNumbersClone,
          codeDisplay: codeDisplayClone
        };
      }
      
      // 更新录制视图的代码和行号
      function updateRecordingView(text, language) {
        const recordingView = document.getElementById("recording-view");
        if (!recordingView) return;
        
        const lineNumbersClone = recordingView.querySelector("div > div:first-child");
        const codeDisplayClone = document.getElementById("recording-code-display");
        
        // 更新行号
        const lines = text.split("\n");
        const lineCount = lines.length;
        let lineNumbersHTML = "";
        for (let i = 1; i <= lineCount; i++) {
          lineNumbersHTML += `<div>${i}</div>`;
        }
        lineNumbersClone.innerHTML = lineNumbersHTML;
        
        // 更新代码显示
        codeDisplayClone.innerHTML = `<pre><code class="language-${language}">${CodePoster.functions.escapeHTML(text)}</code></pre>`;
        
        // 应用高亮
        const codeBlock = codeDisplayClone.querySelector("pre code");
        if (codeBlock) {
          hljs.highlightElement(codeBlock);
        }
      }
      
      // 录制按钮点击事件
      CodePoster.elements.recordVideoBtn.addEventListener("click", async function () {
        try {
          if (!CodePoster.state.isRecording) {
            // 保存当前代码
            const originalCode = CodePoster.elements.codeInput.value;
            const currentLanguage = CodePoster.elements.languageSelect.value;
            
            // 创建录制视图
            const recordingViewObj = createRecordingView();
            document.body.appendChild(recordingViewObj.view);
            
            // 初始化录制视图
            updateRecordingView("", currentLanguage);
            
            // 等待用户选择录制区域
            alert("请在下一步中选择要录制的区域（建议选择当前浏览器窗口）");
            
            // 开始录制
            const stream = await navigator.mediaDevices.getDisplayMedia({
              video: {
                cursor: "always",
                displaySurface: "window" // 允许用户选择录制区域
              },
              audio: false
            });
            
            // 如果用户取消了选择，则停止录制
            if (!stream) {
              // 移除录制视图
              if (recordingViewObj.view.parentNode) {
                recordingViewObj.view.parentNode.removeChild(recordingViewObj.view);
              }
              return;
            }
            
            // 创建媒体记录器
            CodePoster.state.mediaRecorder = new MediaRecorder(stream);
            CodePoster.state.recordedChunks = [];
            
            // 收集录制的数据
            CodePoster.state.mediaRecorder.ondataavailable = function(e) {
              if (e.data.size > 0) {
                CodePoster.state.recordedChunks.push(e.data);
              }
            };
            
            // 录制完成时的处理
            CodePoster.state.mediaRecorder.onstop = function() {
              // 移除录制视图
              const recordingView = document.getElementById("recording-view");
              if (recordingView && recordingView.parentNode) {
                recordingView.parentNode.removeChild(recordingView);
              }
              
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
            };
            
            // 开始录制
            CodePoster.state.mediaRecorder.start();
            CodePoster.state.isRecording = true;
            
            // 显示录制指示器
            CodePoster.elements.recordingIndicator.classList.add("active");
            
            // 显示取消按钮，隐藏录制按钮
            this.style.display = "none";
            cancelRecordBtn.style.display = "inline-flex";
            
            // 开始模拟打字效果
            setTimeout(async () => {
              // 模拟打字，同时更新录制视图
              let currentText = "";
              for (let i = 0; i < originalCode.length; i++) {
                currentText += originalCode.charAt(i);
                updateRecordingView(currentText, currentLanguage);
                
                // 随机化打字速度，使其更像人工输入
                const randomDelay = 50 + Math.random() * 100;
                await new Promise(resolve => setTimeout(resolve, randomDelay));
              }
              
              // 打字完成后等待一段时间
              setTimeout(() => {
                // 如果仍在录制，则自动停止
                if (CodePoster.state.isRecording && CodePoster.state.mediaRecorder) {
                  CodePoster.state.mediaRecorder.stop();
                }
              }, 2000); // 等待2秒后停止录制
            }, 1000); // 等待1秒后开始打字
          }
        } catch (error) {
          console.error("视频录制失败:", error);
          alert("视频录制失败: " + error.message);
          
          // 移除录制视图
          const recordingView = document.getElementById("recording-view");
          if (recordingView && recordingView.parentNode) {
            recordingView.parentNode.removeChild(recordingView);
          }
          
          CodePoster.state.isRecording = false;
          CodePoster.elements.recordingIndicator.classList.remove("active");
        }
      });
      
      // 取消录制按钮点击事件
      cancelRecordBtn.addEventListener("click", function() {
        if (CodePoster.state.isRecording && CodePoster.state.mediaRecorder) {
          // 停止录制
          CodePoster.state.mediaRecorder.stop();
          
          // 移除录制视图
          const recordingView = document.getElementById("recording-view");
          if (recordingView && recordingView.parentNode) {
            recordingView.parentNode.removeChild(recordingView);
          }
          
          // 重置状态
          CodePoster.state.isRecording = false;
          CodePoster.elements.recordingIndicator.classList.remove("active");
          
          // 显示录制按钮，隐藏取消按钮
          CodePoster.elements.recordVideoBtn.style.display = "inline-flex";
          this.style.display = "none";
          
          // 清空录制的数据
          CodePoster.state.recordedChunks = [];
        }
      });
    }
    
    // 关闭视频模态框
    if (CodePoster.elements.closeVideoModal) {
      CodePoster.elements.closeVideoModal.addEventListener("click", function () {
        CodePoster.elements.videoModal.style.display = "none";
      });
      
      // 点击视频模态框背景关闭
      CodePoster.elements.videoModal.addEventListener("click", function (e) {
        if (e.target === this) {
          this.style.display = "none";
        }
      });
    }
  }, 100);
});