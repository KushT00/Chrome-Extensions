let mediaRecorder;
let recordedChunks = [];

const startButton = document.getElementById("start-recording");
const stopButton = document.getElementById("stop-recording");
const preview = document.getElementById("preview");
const includeAudioCheckbox = document.getElementById("include-audio");

startButton.addEventListener("click", async () => {
  try {
    // Check if the user wants to include audio
    const includeAudio = includeAudioCheckbox.checked;
    
    // Request to capture the screen
    const constraints = {
      video: true,
      audio: includeAudio // Include audio if the checkbox is checked
    };

    const stream = await navigator.mediaDevices.getDisplayMedia(constraints);

    // Assign the stream to the video preview element
    preview.srcObject = stream;

    // Initialize MediaRecorder
    mediaRecorder = new MediaRecorder(stream);

    // Collect data chunks as they become available
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    // Start recording
    mediaRecorder.start();

    // Toggle buttons
    startButton.disabled = true;
    stopButton.disabled = false;
  } catch (error) {
    console.error("Error starting screen capture:", error);
  }
});

stopButton.addEventListener("click", () => {
  // Stop the recording
  mediaRecorder.stop();

  // Download the recording when stopped
  mediaRecorder.onstop = () => {
    const blob = new Blob(recordedChunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "recording.webm";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    // Reset UI after stopping the recording
    startButton.disabled = false;
    stopButton.disabled = true;
    recordedChunks = [];
    preview.srcObject = null;
  };
});
