const state = {
  activeTab: "control",
  isRunning: false,
  note: "",
  timerSeconds: 0,
  timerHandle: null,
  logs: []
};

const elements = {
  connectionPill: document.getElementById("connection-pill"),
  noteInput: document.getElementById("note-input"),
  noteCount: document.getElementById("note-count"),
  feedbackBanner: document.getElementById("feedback-banner"),
  logList: document.getElementById("log-list"),
  previewStateText: document.getElementById("preview-state-text"),
  previewNoteSummary: document.getElementById("preview-note-summary"),
  previewCalibrationSummary: document.getElementById("preview-calibration-summary"),
  historyRunningPill: document.getElementById("history-running-pill"),
  historyNotePill: document.getElementById("history-note-pill"),
  tabButtons: Array.from(document.querySelectorAll(".tab-button")),
  tabPages: Array.from(document.querySelectorAll(".tab-page")),
  previews: [
    {
      timer: document.getElementById("preview-timer"),
      noteText: document.getElementById("preview-note-text"),
      idle: document.getElementById("preview-idle"),
      emoji: document.getElementById("preview-emoji"),
      calibration: document.getElementById("preview-calibration"),
      status: document.getElementById("preview-status")
    },
    {
      timer: document.getElementById("preview-timer-clone"),
      noteText: document.getElementById("preview-note-text-clone"),
      idle: document.getElementById("preview-idle-clone"),
      emoji: document.getElementById("preview-emoji-clone"),
      calibration: document.getElementById("preview-calibration-clone"),
      status: document.getElementById("preview-status-clone")
    }
  ],
  startButton: document.getElementById("start-btn"),
  stopButton: document.getElementById("stop-btn"),
  resetButton: document.getElementById("reset-btn"),
  calibrateButton: document.getElementById("calibrate-btn"),
  applyNoteButton: document.getElementById("apply-note-btn"),
  clearNoteButton: document.getElementById("clear-note-btn")
};

function formatTime(date) {
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatTimer(totalSeconds) {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function addLog(message) {
  state.logs.unshift({
    time: formatTime(new Date()),
    message
  });
  state.logs = state.logs.slice(0, 6);
}

function setFeedback(message, tone = "blue") {
  const palette = {
    blue: { background: "rgba(62, 121, 244, 0.16)", color: "#dfeaff" },
    green: { background: "rgba(59, 127, 83, 0.22)", color: "#e9fff0" },
    amber: { background: "rgba(188, 161, 112, 0.18)", color: "#f4e8c9" },
    red: { background: "rgba(165, 74, 73, 0.22)", color: "#ffd8d6" }
  };

  const selected = palette[tone] || palette.blue;
  elements.feedbackBanner.textContent = message;
  elements.feedbackBanner.style.background = selected.background;
  elements.feedbackBanner.style.color = selected.color;
}

function setActiveTab(tabName) {
  state.activeTab = tabName;
  elements.tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tab === tabName);
  });
  elements.tabPages.forEach((page) => {
    page.classList.toggle("is-active", page.dataset.page === tabName);
  });
}

function getNoteSizeClass(text) {
  if (text.length <= 10) return "size-large";
  if (text.length <= 22) return "size-medium";
  if (text.length <= 36) return "size-small";
  return "size-xsmall";
}

function applyPreviewNote(textElement, textValue) {
  const displayText = textValue || "请输入文本";
  textElement.textContent = displayText;
  textElement.classList.remove("size-large", "size-medium", "size-small", "size-xsmall");
  textElement.classList.add(getNoteSizeClass(displayText));
}

function startTimer() {
  stopTimer();
  state.timerHandle = window.setInterval(() => {
    state.timerSeconds += 1;
    render();
  }, 1000);
}

function stopTimer() {
  if (state.timerHandle) {
    window.clearInterval(state.timerHandle);
    state.timerHandle = null;
  }
}

function renderConnection() {
  elements.connectionPill.textContent = state.isRunning ? "已连接" : "未连接";
}

function renderPreviews() {
  const timerText = formatTimer(state.timerSeconds);
  const noteText = state.note || "";
  const calibrationText = state.isRunning ? "已完成初始化" : "等待初始化";
  const statusText = state.note ? "显示内容已更新" : "未检测到人脸";
  const runningText = state.isRunning ? "程序已启动" : "程序未启动";

  elements.previews.forEach((preview) => {
    preview.timer.textContent = timerText;
    applyPreviewNote(preview.noteText, noteText);
    preview.calibration.textContent = calibrationText;
    preview.idle.textContent = runningText;
    preview.status.textContent = state.isRunning ? statusText : "未检测到人脸";
    preview.emoji.classList.add("hidden");
  });

  elements.previewStateText.textContent = runningText;
  elements.previewNoteSummary.textContent = noteText || "请输入文本";
  elements.previewCalibrationSummary.textContent = calibrationText;
  elements.historyRunningPill.textContent = runningText;
  elements.historyNotePill.textContent = noteText ? `文字：${noteText}` : "暂无文字";
}

function renderLogs() {
  elements.logList.innerHTML = "";
  state.logs.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `<span class="log-time">${entry.time}</span>${entry.message}`;
    elements.logList.appendChild(li);
  });
}

function render() {
  renderConnection();
  renderPreviews();
  renderLogs();
  elements.noteCount.textContent = `${elements.noteInput.value.length} / 50`;
}

function handleStart() {
  state.isRunning = true;
  startTimer();
  setFeedback("程序已启动，远程控制已连接。", "green");
  addLog("启动程序：界面已切换到运行状态。");
  render();
}

function handleStop() {
  state.isRunning = false;
  stopTimer();
  setFeedback("程序已停止。", "red");
  addLog("停止程序：界面已切换到停止状态。");
  render();
}

function handleReset() {
  state.timerSeconds = 0;
  state.note = "";
  elements.noteInput.value = "";
  setFeedback("已完成重置。", "amber");
  addLog("重置状态：计时器、文字和显示状态已恢复默认值。");
  render();
}

function handleCalibrate() {
  setFeedback("已重新校准表情。", "blue");
  addLog("重新校准：已更新当前表情基准。");
  render();
}

function handleApplyNote() {
  state.note = elements.noteInput.value.trim();
  setFeedback(state.note ? "文字已更新到程序界面。" : "显示文字已清空。", "green");
  addLog(state.note ? `更新文字：${state.note}` : "更新文字：已清空显示内容。");
  render();
}

function handleClearNote() {
  elements.noteInput.value = "";
  state.note = "";
  setFeedback("输入内容已清空。", "amber");
  addLog("清空文字：等待新的输入内容。");
  render();
}

elements.tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});
elements.startButton.addEventListener("click", handleStart);
elements.stopButton.addEventListener("click", handleStop);
elements.resetButton.addEventListener("click", handleReset);
elements.calibrateButton.addEventListener("click", handleCalibrate);
elements.applyNoteButton.addEventListener("click", handleApplyNote);
elements.clearNoteButton.addEventListener("click", handleClearNote);
elements.noteInput.addEventListener("input", render);

addLog("控制界面已就绪。");
setFeedback("等待操作", "blue");
setActiveTab("control");
render();
