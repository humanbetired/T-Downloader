const urlInput = document.getElementById("url");
const typeSelect = document.getElementById("type");
const downloadBtn = document.getElementById("downloadBtn");
const status = document.getElementById("status");
const downloadLink = document.getElementById("downloadLink");
const downloadText = document.getElementById("downloadText");

downloadBtn.addEventListener("click", async () => {
    const url = urlInput.value.trim();
    const type = typeSelect.value;

    if (!url) {
        showStatus("Masukkan link TikTok terlebih dahulu", "error");
        downloadLink.classList.add("hidden");
        return;
    }

    if (!url.includes("tiktok.com")) {
        showStatus("Link TikTok tidak valid", "error");
        return;
    }

    showStatus("Sedang memproses...", "loading");
    downloadLink.classList.add("hidden");

    try {
        const res = await fetch("https://www.tikwm.com/api/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        const data = await res.json();
        
        if (data.code !== 0) {
            showStatus("Gagal mengambil konten. Coba link yang berbeda.", "error");
            return;
        }

        const link = type === "mp3" ? data.data.music : data.data.play;

        if (link) {
            showStatus("Siap untuk diunduh!", "success");
            downloadLink.href = link;
            downloadText.textContent = type === "mp3" ? "Unduh Audio (MP3)" : "Unduh Video (MP4)";
            downloadLink.classList.remove("hidden");
        } else {
            showStatus("Link download tidak ditemukan", "error");
        }
    } catch (err) {
        console.error(err);
        showStatus("Terjadi kesalahan pada server", "error");
    }
});

function showStatus(message, type) {
    status.textContent = message;
    status.className = "text-center text-sm font-medium min-h-6";
    
    switch(type) {
        case "error":
            status.classList.add("text-red-500");
            break;
        case "success":
            status.classList.add("text-green-500");
            break;
        case "loading":
            status.classList.add("text-indigo-500");
            break;
        default:
            status.classList.add("text-gray-500");
    }
}