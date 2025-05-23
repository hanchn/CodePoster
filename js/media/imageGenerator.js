// 图片生成功能
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块和事件系统加载完成
  setTimeout(() => {
    if (!window.CodePoster || !CodePoster.events) return;
    
    // 注册生成图片事件处理函数
    CodePoster.events.onGenerateImage = async function() {
      try {
        console.log("生成图片");
        
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
    };
    
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
  }, 150);
});