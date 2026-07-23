function buildRingtone() {
  const sampleRate = 22050;
  const durSec = 1.0;
  const total = Math.floor(sampleRate * durSec);
  const buf = new Uint8Array(44 + total * 2);
  const view = new DataView(buf.buffer);
  const writeStr = (o, s) => { for (let i = 0; i < s.length; i++) view.setUint8(o + i, s.charCodeAt(i)); };
  writeStr(0, "RIFF");
  view.setUint32(4, 36 + total * 2, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, "data");
  view.setUint32(40, total * 2, true);
  for (let i = 0; i < total; i++) {
    const t = i / sampleRate;
    const env = 0.5 * (1 - Math.cos((2 * Math.PI * i) / total));
    const sample = env * 0.5 * (Math.sin(2 * Math.PI * 480 * t) + Math.sin(2 * Math.PI * 620 * t));
    const s16 = Math.max(-1, Math.min(1, sample)) * 32767;
    view.setInt16(44 + i * 2, s16, true);
  }
  let bin = "";
  for (let i = 0; i < buf.length; i++) bin += String.fromCharCode(buf[i]);
  return "data:audio/wav;base64," + btoa(bin);
}

export const RINGTONE_DATA_URI = buildRingtone();
