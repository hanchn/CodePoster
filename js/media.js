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
        
        // 应用高度设置
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
        
        // 获取编辑器容器
        const editorContainer = CodePoster.elements.editorContainer;
        
        if (height > 0) {
          // 设置固定高度
          // 为编辑器容器设置高度
          editorContainer.style.height = height + 'px';
          
          // 设置编辑器组件高度
          CodePoster.elements.codeInput.style.height = '100%';
          CodePoster.elements.codeDisplay.style.height = '100%';
          CodePoster.elements.lineNumbers.style.height = '100%';
          
          // 确保滚动条显示 - 明确设置overflow属性
          CodePoster.elements.codeInput.style.overflow = 'auto';
          CodePoster.elements.codeDisplay.style.overflow = 'auto';
          CodePoster.elements.lineNumbers.style.overflow = 'auto';
          
          // 设置滚动条样式，使其更明显
          const scrollbarStyle = `
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
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
          
          // 添加滚动条样式
          if (!document.getElementById('scrollbar-style')) {
            const styleEl = document.createElement('style');
            styleEl.id = 'scrollbar-style';
            styleEl.textContent = scrollbarStyle;
            document.head.appendChild(styleEl);
          }
        } else {
          // 自适应高度 - 移除固定高度限制
          editorContainer.style.height = 'auto';
          
          // 重置编辑器组件高度
          CodePoster.elements.codeInput.style.height = 'auto';
          CodePoster.elements.codeDisplay.style.height = 'auto';
          CodePoster.elements.lineNumbers.style.height = 'auto';
          
          // 最小高度
          CodePoster.elements.codeInput.style.minHeight = '200px';
          CodePoster.elements.codeDisplay.style.minHeight = '200px';
          CodePoster.elements.lineNumbers.style.minHeight = '200px';
          
          // 保持滚动条设置
          CodePoster.elements.codeInput.style.overflow = 'auto';
          CodePoster.elements.codeDisplay.style.overflow = 'auto';
          CodePoster.elements.lineNumbers.style.overflow = 'auto';
        }
        
        // 确保编辑器内容自动换行
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
        
        // 强制重新计算布局
        setTimeout(() => {
          // 触发重新渲染
          window.dispatchEvent(new Event('resize'));
          
          // 强制刷新滚动区域
          if (height > 0) {
            // 临时增加内容高度，确保滚动条显示
            const tempPadding = CodePoster.elements.codeInput.style.paddingBottom;
            CodePoster.elements.codeInput.style.paddingBottom = '1px';
            setTimeout(() => {
              CodePoster.elements.codeInput.style.paddingBottom = tempPadding;
            }, 50);
          }
        }, 10);
      }
      
      // 修改录制指示器样式，使其不被录制
      CodePoster.elements.recordingIndicator.style.position = "fixed";
      CodePoster.elements.recordingIndicator.style.top = "10px";
      CodePoster.elements.recordingIndicator.style.right = "10px";
      CodePoster.elements.recordingIndicator.style.zIndex = "9999";
      
      // 设置编辑器自动换行 - 改进版
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
          // 使用用户设置的速度或默认速度
          const typingSpeed = speed || (CodePoster.state.typingSpeed ? CodePoster.state.typingSpeed.value : 50);
          
          // 保存原始代码
          const originalCode = CodePoster.elements.codeInput.value;
          
          // 清空编辑器
          CodePoster.elements.codeInput.value = '';
          
          // 触发input事件以更新高亮和行号
          const inputEvent = new Event('input', { bubbles: true });
          CodePoster.elements.codeInput.dispatchEvent(inputEvent);
          
          // 应用当前的编辑器高度设置
          applyEditorHeight();
          
          let i = 0;
          
          function typeChar() {
            if (i < text.length) {
              // 添加一个字符
              CodePoster.elements.codeInput.value += text.charAt(i);
              i++;
              
              // 触发input事件以更新高亮和行号
              CodePoster.elements.codeInput.dispatchEvent(inputEvent);
              
              // 自动滚动到底部
              CodePoster.elements.codeInput.scrollTop = CodePoster.elements.codeInput.scrollHeight;
              
              // 同时滚动代码显示区域到底部
              if (CodePoster.elements.codeDisplay) {
                CodePoster.elements.codeDisplay.scrollTop = CodePoster.elements.codeDisplay.scrollHeight;
              }
              
              // 同时滚动行号区域到底部
              if (CodePoster.elements.lineNumbers) {
                CodePoster.elements.lineNumbers.scrollTop = CodePoster.elements.lineNumbers.scrollHeight;
              }
              
              // 使用设置的打字速度，添加少量随机性
              const randomDelay = typingSpeed + Math.random() * (typingSpeed * 0.5);
              setTimeout(typeChar, randomDelay);
            } else {
              resolve();
            }
          }
          
          // 开始打字
          typeChar();
        });
      }
      
      // 录制按钮点击事件
      CodePoster.elements.recordVideoBtn.addEventListener("click", async function () {
        try {
          if (!CodePoster.state.isRecording) {
            // 保存当前代码
            const originalCode = CodePoster.elements.codeInput.value;
            const currentLanguage = CodePoster.elements.languageSelect.value;
            
            // 获取当前设置的打字速度
            const typingSpeed = CodePoster.state.typingSpeed ? CodePoster.state.typingSpeed.value : 50;
            
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
            
            // 显示取消按钮，隐藏录制按钮
            this.style.display = "none";
            cancelRecordBtn.style.display = "inline-flex";
            
            // 开始模拟打字效果
            setTimeout(async () => {
              // 清空编辑器
              CodePoster.elements.codeInput.value = '';
              const inputEvent = new Event('input', { bubbles: true });
              CodePoster.elements.codeInput.dispatchEvent(inputEvent);
              
              // 等待一小段时间
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // 开始模拟打字，使用设置的速度
              await simulateTyping(originalCode, typingSpeed);
              
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
          
          CodePoster.state.isRecording = false;
          CodePoster.elements.recordingIndicator.classList.remove("active");
        }
      });
      
      // 取消录制按钮点击事件
      cancelRecordBtn.addEventListener("click", function() {
        if (CodePoster.state.isRecording && CodePoster.state.mediaRecorder) {
          // 停止录制
          CodePoster.state.mediaRecorder.stop();
          
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