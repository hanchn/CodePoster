// 媒体功能入口文件
document.addEventListener("DOMContentLoaded", function () {
  console.log("媒体模块初始化");
  
  // 确保 CodePoster 对象存在
  if (!window.CodePoster) {
    console.error("CodePoster 对象未定义");
    window.CodePoster = {
      elements: {},
      state: {
        isRecording: false,
        typingSpeed: { value: 50 },
        editorHeight: { value: 0 }
      }
    };
  }
  
  // 初始化状态对象
  if (!CodePoster.state) {
    CodePoster.state = {
      isRecording: false,
      typingSpeed: { value: 50 },
      editorHeight: { value: 0 }
    };
  }
  
  // 加载拆分后的模块
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      console.log("加载模块:", src);
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        console.log("模块加载成功:", src);
        resolve();
      };
      script.onerror = (err) => {
        console.error("模块加载失败:", src, err);
        reject(err);
      };
      document.body.appendChild(script);
    });
  };
  
  // 直接加载视频录制模块
  loadScript('js/videoRecorder.js')
    .then(() => {
      console.log("视频录制模块加载完成");
    })
    .catch(err => {
      console.error("视频录制模块加载失败:", err);
      // 如果加载失败，尝试内联实现视频录制功能
      // ... 内联实现视频录制功能的代码 ...
    });
  
  // 按顺序加载其他模块
  Promise.resolve()
    .then(() => loadScript('js/editorUtils.js'))
    .then(() => loadScript('js/typingSimulator.js'))
    .then(() => loadScript('js/imageGenerator.js'))
    .catch(err => {
      console.error("加载模块失败:", err);
    });
});