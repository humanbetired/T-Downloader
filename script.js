const urlInput = document.getElementById("url");
const typeSelect = document.getElementById("type");
const downloadBtn = document.getElementById("downloadBtn");
const status = document.getElementById("status");

downloadBtn.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  const type = typeSelect.value;

  if (!url) {
    status.textContent = "Masukkan link TikTok dulu!";
    return;
  }

  status.textContent = "Memproses...";

  try {
    const res = await fetch("https://www.tikwm.com/api/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });

    const data = await res.json();
    const fileUrl = type === "mp3" ? data.data.music : data.data.play;

    if (fileUrl) {
      status.textContent = "Mengunduh...";

      const fileRes = await fetch(fileUrl);
      const blob = await fileRes.blob();

      const a = document.createElement("a");
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = type === "mp3" ? "audio.mp3" : "video.mp4";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      URL.revokeObjectURL(objectUrl);

      status.textContent = "Download dimulai!";
    } else {
      status.textContent = "Gagal mengambil link download.";
    }
  } catch (err) {
    console.error(err);
    status.textContent = "Terjadi error server.";
  }
});
