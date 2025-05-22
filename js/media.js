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
      CodePoster.elements.recordVideoBtn.addEventListener("click", async function () {
        try {
          if (!CodePoster.state.isRecording) {
            // 开始录制
            const stream = await navigator.mediaDevices.getDisplayMedia({
              video: {
                cursor: "always",
                displaySurface: "window"
              },
              audio: false
            });
            
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
              
              // 停止所有轨道
              stream.getTracks().forEach(track => track.stop());
              
              // 重置录制状态
              CodePoster.state.isRecording = false;
              CodePoster.elements.recordingIndicator.classList.remove("active");
            };
            
            // 开始录制
            CodePoster.state.mediaRecorder.start();
            CodePoster.state.isRecording = true;
            
            // 显示录制指示器
            CodePoster.elements.recordingIndicator.classList.add("active");
          } else {
            // 停止录制
            if (CodePoster.state.mediaRecorder) {
              CodePoster.state.mediaRecorder.stop();
            }
          }
        } catch (error) {
          console.error("视频录制失败:", error);
          alert("视频录制失败: " + error.message);
          CodePoster.state.isRecording = false;
          CodePoster.elements.recordingIndicator.classList.remove("active");
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