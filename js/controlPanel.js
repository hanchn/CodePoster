document.addEventListener('DOMContentLoaded', function() {
  const panel = document.getElementById('bottom-control-panel');
  const toggleBtn = document.getElementById('toggle-btn');
  const recordBtn = document.getElementById('record-video-btn');
  
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

  // 监听视频录制状态
  if (recordBtn) {
    recordBtn.addEventListener('click', function() {
      // 开始录制时自动收起面板
      togglePanel(false);
    });

    // 监听取消录制按钮
    const cancelRecordBtn = document.getElementById('cancel-record-btn');
    if (cancelRecordBtn) {
      cancelRecordBtn.addEventListener('click', function() {
        // 取消录制时自动展开面板
        togglePanel(true);
      });
    }

    // 监听录制完成事件
    document.addEventListener('recordingComplete', function() {
      // 录制完成时自动展开面板
      togglePanel(true);
    });
  }
});