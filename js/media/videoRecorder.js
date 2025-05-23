// 视频录制功能
document.addEventListener("DOMContentLoaded", function () {
  // 等待核心模块和事件系统加载完成
  setTimeout(() => {
    if (!window.CodePoster || !CodePoster.events) return;
    
    // 创建悬浮控制面板
    setupFloatingPanel();
    
    // 注册视频录制事件处理函数
    CodePoster.events.onRecordVideo = async function() {
      // 触发悬浮面板中的录制按钮
      document.getElementById("floating-record-video-btn").click();
    };
    
    // 设置悬浮控制面板
    function setupFloatingPanel() {
      // 创建悬浮控制面板
      const floatingPanel = document.createElement("div");
      floatingPanel.className = "floating-control-panel";
      floatingPanel.style.position = "fixed";
      floatingPanel.style.left = "0";
      floatingPanel.style.bottom = "0";
      floatingPanel.style.width = "100%";
      floatingPanel.style.backgroundColor = "#2d2d2d";
      floatingPanel.style.border = "1px solid #444";
      floatingPanel.style.borderBottom = "none";
      floatingPanel.style.borderRadius = "5px 5px 0 0";
      floatingPanel.style.padding = "10px";
      floatingPanel.style.boxShadow = "0 -2px 10px rgba(0, 0, 0, 0.3)";
      floatingPanel.style.zIndex = "1000";
      floatingPanel.style.transition = "transform 0.3s ease";
      floatingPanel.style.display = "flex";
      floatingPanel.style.alignItems = "center";
      floatingPanel.style.justifyContent = "center";
      
      // 创建收起/展开按钮
      const toggleButton = document.createElement("button");
      toggleButton.className = "toggle-panel-btn";
      toggleButton.innerHTML = "▼";
      toggleButton.style.position = "absolute";
      toggleButton.style.right = "10px";
      toggleButton.style.top = "-25px";
      toggleButton.style.width = "30px";
      toggleButton.style.height = "25px";
      toggleButton.style.backgroundColor = "#2d2d2d";
      toggleButton.style.border = "1px solid #444";
      toggleButton.style.borderBottom = "none";
      toggleButton.style.borderRadius = "5px 5px 0 0";
      toggleButton.style.cursor = "pointer";
      toggleButton.style.color = "#ccc";
      toggleButton.style.fontSize = "12px";
      toggleButton.style.display = "flex";
      toggleButton.style.alignItems = "center";
      toggleButton.style.justifyContent = "center";
      
      // 创建录制按钮容器
      const recordBtnContainer = document.createElement("div");
      recordBtnContainer.style.display = "flex";
      recordBtnContainer.style.alignItems = "center";
      recordBtnContainer.style.marginRight = "20px";
      
      // 创建录制按钮
      const newRecordBtn = document.createElement("button");
      newRecordBtn.id = "floating-record-video-btn";
      newRecordBtn.className = "btn";
      newRecordBtn.innerHTML = CodePoster.elements.recordVideoBtn.innerHTML;
      newRecordBtn.style.backgroundColor = "#4caf50";
      
      // 创建取消录制按钮
      const cancelRecordBtn = document.createElement("button");
      cancelRecordBtn.id = "cancel-record-btn