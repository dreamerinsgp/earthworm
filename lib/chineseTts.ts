/**
 * Chinese pronunciation: Youdao TTS (with le=zh), then Web Speech API fallback.
 */

const YOUDAO_VOICE = "https://dict.youdao.com/dictvoice";

let lastAudio: HTMLAudioElement | null = null;

export function chineseTtsUrl(text: string): string {
  const q = encodeURIComponent(text.trim());
  return `${YOUDAO_VOICE}?audio=${q}&le=zh`;
}

/** Stop any in-flight browser TTS from this module. */
export function stopChinesePronunciation(): void {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  if (lastAudio) {
    lastAudio.pause();
    lastAudio.removeAttribute("src");
    lastAudio.load();
    lastAudio = null;
  }
}

function speakWithWebSpeech(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.92;
    u.onend = () => resolve();
    u.onerror = () => resolve();
    window.speechSynthesis.speak(u);
  });
}

/**
 * Play pronunciation for Chinese text. Safe to call from click handlers.
 */
export function playChinesePronunciation(text: string): Promise<void> {
  const trimmed = text.trim();
  if (!trimmed) return Promise.resolve();

  stopChinesePronunciation();

  return new Promise((resolve) => {
    const url = chineseTtsUrl(trimmed);
    const audio = new Audio(url);
    lastAudio = audio;

    const finish = () => {
      if (lastAudio === audio) lastAudio = null;
      resolve();
    };

    const trySpeech = () => {
      void speakWithWebSpeech(trimmed).then(finish);
    };

    audio.addEventListener("ended", finish, { once: true });
    audio.addEventListener(
      "error",
      () => {
        trySpeech();
      },
      { once: true }
    );

    audio.play().catch(() => {
      trySpeech();
    });
  });
}
