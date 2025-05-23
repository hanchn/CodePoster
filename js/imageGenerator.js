export function setupImageGeneration() {
  if (!CodePoster.elements.generateImageBtn) {
    console.error("未找到生成图片按钮");
    return;
  }

  CodePoster.elements.generateImageBtn.addEventListener("click", async function () {
    try {
      // 获取当前代码和语言
      const code = CodePoster.elements.codeInput.value;
      const language = CodePoster.elements.languageSelect.value;
      
      // 创建canvas元素
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 设置canvas尺寸
      canvas.width = CodePoster.elements.editorContainer.offsetWidth;
      canvas.height = CodePoster.elements.editorContainer.offsetHeight;
      
      // 绘制背景
      ctx.fillStyle = '#1e1e1e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 绘制代码文本
      ctx.font = '14px Consolas, monospace';
      ctx.fillStyle = '#d4d4d4';
      
      // 分行绘制代码
      const lines = code.split('\n');
      const lineHeight = 20;
      const padding = 15;
      
      lines.forEach((line, index) => {
        ctx.fillText(line, padding, padding + (index * lineHeight));
      });
      
      // 转换为图片
      const imageUrl = canvas.toDataURL('image/png');
      
      // 显示图片预览
      CodePoster.elements.imagePreview.src = imageUrl;
      CodePoster.elements.imageModal.style.display = 'flex';
      
    } catch (error) {
      console.error('生成图片失败:', error);
      alert('生成图片时出错: ' + error.message);
    }
  });

  // 图片下载功能
  CodePoster.elements.downloadBtn.addEventListener("click", function () {
    const a = document.createElement('a');
    a.href = CodePoster.elements.imagePreview.src;
    a.download = `code-${new Date().getTime()}.png`;
    a.click();
  });

  // 图片模态框关闭功能
  CodePoster.elements.closeModal.addEventListener("click", function () {
    CodePoster.elements.imageModal.style.display = 'none';
  });

  CodePoster.elements.imageModal.addEventListener("click", function (e) {
    if (e.target === CodePoster.elements.imageModal) {
      CodePoster.elements.imageModal.style.display = 'none';
    }
  });
}