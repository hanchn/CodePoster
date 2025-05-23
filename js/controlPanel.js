document.addEventListener('DOMContentLoaded', function() {
  const panel = document.getElementById('bottom-control-panel');
  const toggleBtn = document.getElementById('toggle-btn');
  const recordBtn = document.getElementById('record-video-btn');
  const header = document.querySelector('header'); // 获取标题区域
  
  if (!panel || !toggleBtn) {
    console.error('找不到控制面板元素');
    return;
  }

  // 面板收起/展开功能
  function togglePanel(forceState) {
    if (typeof forceState === 'boolean') {
      if (forceState) {
        panel.classList.remove('collapsed');
      } else {
        panel.classList.add('collapsed');
      }
    } else {
      panel.classList.toggle('collapsed');
    }
    
    const isCollapsed = panel.classList.contains('collapsed');
    toggleBtn.innerHTML = isCollapsed ? '▲' : '▼';
    localStorage.setItem('controlPanelCollapsed', isCollapsed);
  }

  // 绑定点击事件
  toggleBtn.addEventListener('click', () => togglePanel());

  // 恢复面板状态
  const isCollapsed = localStorage.getItem('controlPanelCollapsed') === 'true';
  if (isCollapsed) {
    panel.classList.add('collapsed');
    toggleBtn.innerHTML = '▲';
  }

  // 控制标题显示/隐藏的函数
  function toggleHeader(show) {
    if (header) {
      header.style.display = show ? 'block' : 'none';
    }
  }

  // 监听视频录制状态
  if (recordBtn) {
    recordBtn.addEventListener('click', function() {
      // 开始录制时自动收起面板
      togglePanel(false);
      // 隐藏标题
      toggleHeader(false);
    });

    // 监听取消录制按钮
    const cancelRecordBtn = document.getElementById('cancel-record-btn');
    if (cancelRecordBtn) {
      cancelRecordBtn.addEventListener('click', function() {
        // 取消录制时自动展开面板
        togglePanel(true);
        // 显示标题
        toggleHeader(true);
      });
    }

    // 监听录制完成事件
    document.addEventListener('recordingComplete', function() {
      // 录制完成时自动展开面板
      togglePanel(true);
      // 显示标题
      toggleHeader(true);
    });
  }
  
  // 添加代码自动滚动到底部的功能
  function setupAutoScroll() {
    const codeInput = document.getElementById('code-input');
    const codeDisplay = document.getElementById('code-display');
    const lineNumbers = document.querySelector('.line-numbers');
    
    if (codeInput && codeDisplay) {
      // 监听输入变化，自动滚动到底部
      codeInput.addEventListener('input', function() {
        scrollToBottom();
      });
      
      // 监听模拟打字事件
      document.addEventListener('typingSimulated', function() {
        scrollToBottom();
      });
      
      // 监听代码更新事件
      document.addEventListener('codeUpdated', function() {
        scrollToBottom();
      });
      
      // 创建MutationObserver监听代码内容变化
      const observer = new MutationObserver(function(mutations) {
        scrollToBottom();
      });
      
      // 配置观察选项
      const config = { childList: true, subtree: true, characterData: true };
      
      // 开始观察代码显示区域
      observer.observe(codeDisplay, config);
      
      // 定期检查滚动位置，确保始终在底部
      setInterval(function() {
        // 检查是否正在自动输入代码
        if (document.body.classList.contains('typing') || 
            document.querySelector('.recording-indicator.active')) {
          scrollToBottom();
        }
      }, 500);
    }
    
    // 滚动到底部的函数
    function scrollToBottom() {
      // 延迟执行，确保内容已更新
      setTimeout(function() {
        if (codeInput) {
          codeInput.scrollTop = codeInput.scrollHeight;
        }
        if (codeDisplay) {
          codeDisplay.scrollTop = codeDisplay.scrollHeight;
        }
        if (lineNumbers) {
          lineNumbers.scrollTop = lineNumbers.scrollHeight;
        }
      }, 50); // 增加延迟时间，确保内容已完全更新
    }
  }
  
  // 初始化自动滚动功能
  setupAutoScroll();
});