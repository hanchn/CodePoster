document.addEventListener('DOMContentLoaded', function() {
  const panel = document.getElementById('bottom-control-panel');
  const toggleBtn = document.getElementById('toggle-btn');
  
  // 面板收起/展开功能
  function togglePanel() {
    panel.classList.toggle('collapsed');
    localStorage.setItem('controlPanelCollapsed', panel.classList.contains('collapsed'));
    
    // 更新按钮图标
    toggleBtn.innerHTML = panel.classList.contains('collapsed') ? '▲' : '▼';
    
    // 添加过渡动画完成后的处理
    panel.addEventListener('transitionend', function handler() {
      panel.removeEventListener('transitionend', handler);
      window.dispatchEvent(new Event('resize')); // 触发resize事件以更新编辑器布局
    });
  }
  
  // 点击切换按钮时触发面板切换
  toggleBtn.addEventListener('click', togglePanel);
  
  // 恢复面板状态
  function restorePanelState() {
    const isCollapsed = localStorage.getItem('controlPanelCollapsed') === 'true';
    if (isCollapsed) {
      panel.classList.add('collapsed');
      toggleBtn.innerHTML = '▲';
    }
  }
  
  // 初始化时恢复状态
  restorePanelState();
  
  // 添加触摸支持
  let touchStartY = 0;
  let touchEndY = 0;
  
  panel.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
  }, false);
  
  panel.addEventListener('touchmove', function(e) {
    touchEndY = e.touches[0].clientY;
    const deltaY = touchEndY - touchStartY;
    
    // 如果向上滑动超过20px且面板已收起，则展开
    if (deltaY < -20 && panel.classList.contains('collapsed')) {
      togglePanel();
    }
    // 如果向下滑动超过20px且面板已展开，则收起
    else if (deltaY > 20 && !panel.classList.contains('collapsed')) {
      togglePanel();
    }
  }, false);
});