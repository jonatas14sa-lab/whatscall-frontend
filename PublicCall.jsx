import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Volume2, Camera, UserSquare2, MessageSquare, Grid3x3, ArrowLeft } from "lucide-react";
import { api, fileUrl } from "@/lib/api";
import { RINGTONE_DATA_URI } from "@/lib/ringtone";

function useRingtone(active) {
  const audioRef = useRef(null);
  useEffect(() => {
    if (!active) return;
    const audio = new Audio(RINGTONE_DATA_URI);
    audio.loop = true;
    audio.volume = 0.6;
    audioRef.current = audio;
    const play = () => audio.play().catch(() => {});
    play();
    const gesture = () => { play(); document.removeEventListener("pointerdown", gesture); };
    document.addEventListener("pointerdown", gesture);
    return () => { audio.pause(); audio.src = ""; document.removeEventListener("pointerdown", gesture); };
  }, [active]);
  return audioRef;
}

function useVibration(active) {
  useEffect(() => {
    if (!active || !("vibrate" in navigator)) return;
    const pattern = [400, 600, 400, 1200];
    const safeVibrate = (p) => { try { navigator.vibrate(p); } catch (_) { /* noop */ } };
    const id = setInterval(() => safeVibrate(pattern), 2200);
    safeVibrate(pattern);
    return () => { clearInterval(id); safeVibrate(0); };
  }, [active]);
}

function formatDuration(sec) {
  const s = Math.max(0, Math.floor(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    return `${String(h).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function Loading() {
  return (
    <div className="public-scope grid h-[100dvh] w-full place-items-center bg-[#0B141A] text-slate-200">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
        <p className="text-sm text-slate-400">Conectando...</p>
      </div>
    </div>
  );
}

function ErrorScreen({ title, subtitle }) {
  return (
    <div className="public-scope grid h-[100dvh] w-full place-items-center bg-[#0B141A] px-6 text-center text-slate-200">
      <div>
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-red-500/15 ring-1 ring-red-400/40">
          <PhoneOff className="h-7 w-7 text-red-400" />
        </div>
        <p className="text-xl">{title}</p>
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        <Link to="/" className="mt-6 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 hover:bg-white/10">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
      </div>
    </div>
  );
}

function IncomingScreen({ call, onAccept, onDecline }) {
  useRingtone(true);
  useVibration(true);
  const isVideo = call.call_type === "video";
  return (
    <div className="public-scope fadein relative h-[100dvh] w-full overflow-hidden bg-gradient-to-b from-[#0B141A] via-[#0f2027] to-[#0B141A] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-[radial-gradient(circle_at_top,rgba(37,211,102,0.15),transparent_60%)]" />
      <div className="flex h-full flex-col items-center justify-between py-10">
        <div className="flex flex-col items-center text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/70">
            {isVideo ? "Chamada de vídeo" : "Chamada de voz"} do WhatsApp
          </p>
          <p className="mt-1 text-sm text-white/60">{call.status_text}</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative">
            <span className="absolute inset-0 -z-10 rounded-full bg-emerald-500/25 pulse-ring" />
            <span className="absolute inset-0 -z-10 rounded-full bg-emerald-500/20 pulse-ring-delayed" />
            <div className="soft-bob h-40 w-40 overflow-hidden rounded-full ring-4 ring-white/10 shadow-2xl shadow-emerald-900/40 sm:h-48 sm:w-48">
              {call.photo_url ? (
                <img alt="" src={fileUrl(call.photo_url)} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-emerald-800 text-4xl font-medium">
                  {call.contact_name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
          </div>
          <p className="mt-6 font-medium text-2xl sm:text-3xl" data-testid="incoming-contact-name">{call.contact_name}</p>
          <p className="text-sm text-white/60">{isVideo ? "chamada de vídeo" : "chamada de voz"}</p>
        </div>
        <div className="flex w-full items-end justify-around px-10 sm:max-w-md">
          <button onClick={onDecline} aria-label="Recusar chamada" data-testid="decline-call-btn" className="flex flex-col items-center gap-2 focus:outline-none">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-red-500 shadow-xl shadow-red-900/40 transition active:scale-95">
              <Phone className="h-7 w-7 rotate-[135deg] text-white" />
            </span>
            <span className="text-xs text-white/80">Recusar</span>
          </button>
          <button onClick={onAccept} aria-label="Atender chamada" data-testid="accept-call-btn" className="flex flex-col items-center gap-2 focus:outline-none">
            <span className="relative grid h-16 w-16 place-items-center rounded-full bg-emerald-500 shadow-xl shadow-emerald-900/40 transition active:scale-95">
              <span className="absolute inset-0 -z-10 rounded-full bg-emerald-500/40 pulse-ring" />
              {isVideo ? <Video className="h-7 w-7 text-white" /> : <Phone className="h-7 w-7 text-white" />}
            </span>
            <span className="text-xs text-white/80">Atender</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function ActiveCall({ call, onEnded, onEndClick }) {
  const videoRef = useRef(null);
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [speaker, setSpeaker] = useState(true);
  const isVideo = call.call_type === "video";

  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    v.muted = false;
    const play = () => v.play().catch(() => { v.muted = true; v.play().catch(() => {}); });
    play();
    const onEnd = () => onEnded();
    v.addEventListener("ended", onEnd);
    return () => v.removeEventListener("ended", onEnd);
  }, [onEnded]);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 500);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { const v = videoRef.current; if (v) v.muted = muted; }, [muted]);

  return (
    <div className="public-scope fadein relative h-[100dvh] w-full overflow-hidden bg-black text-white">
      <video ref={videoRef} src={fileUrl(call.video_url)} playsInline autoPlay className={`absolute inset-0 h-full w-full ${isVideo ? "object-cover" : "hidden"}`} data-testid="call-video" />
      {!isVideo && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#0B141A] via-[#0f2027] to-[#0B141A]">
          <div className="h-40 w-40 overflow-hidden rounded-full ring-4 ring-white/10">
            {call.photo_url ? (
              <img alt="" src={fileUrl(call.photo_url)} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center bg-emerald-800 text-4xl">{call.contact_name?.[0]}</div>
            )}
          </div>
        </div>
      )}

      {isVideo && !camOff && (
        <div className="absolute right-4 top-4 h-32 w-24 overflow-hidden rounded-xl bg-black/50 ring-1 ring-white/10 sm:h-40 sm:w-28">
          <div className="grid h-full w-full place-items-center bg-gradient-to-b from-slate-800 to-slate-900 text-slate-400">
            <UserSquare2 className="h-8 w-8" />
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/60 to-transparent px-5 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-medium sm:text-lg" data-testid="active-contact-name">{call.contact_name}</p>
            <p className="text-xs text-white/80" data-testid="call-timer">{formatDuration(elapsed)}</p>
          </div>
          <div className="flex items-center gap-4 text-white/85">
            <Grid3x3 className="h-5 w-5" />
            <Camera className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-6 pb-8 pt-16">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <button onClick={() => setSpeaker((s) => !s)} className="grid h-12 w-12 place-items-center rounded-full bg-white/10 backdrop-blur transition active:scale-95" aria-label="Alto-falante" data-testid="btn-speaker">
            <Volume2 className={`h-5 w-5 ${speaker ? "text-white" : "text-white/50"}`} />
          </button>
          <button onClick={() => setCamOff((v) => !v)} className="grid h-12 w-12 place-items-center rounded-full bg-white/10 backdrop-blur transition active:scale-95" aria-label="Câmera" data-testid="btn-camera">
            {camOff ? <VideoOff className="h-5 w-5 text-white/60" /> : <Video className="h-5 w-5 text-white" />}
          </button>
          <button onClick={() => setMuted((m) => !m)} className="grid h-12 w-12 place-items-center rounded-full bg-white/10 backdrop-blur transition active:scale-95" aria-label="Microfone" data-testid="btn-mic">
            {muted ? <MicOff className="h-5 w-5 text-white/60" /> : <Mic className="h-5 w-5 text-white" />}
          </button>
          <button className="grid h-12 w-12 place-items-center rounded-full bg-white/10 backdrop-blur transition active:scale-95" aria-label="Mensagem" data-testid="btn-chat">
            <MessageSquare className="h-5 w-5 text-white" />
          </button>
          <button onClick={onEndClick} className="grid h-14 w-14 place-items-center rounded-full bg-red-500 shadow-lg shadow-red-900/40 transition active:scale-95" aria-label="Encerrar" data-testid="btn-end-call">
            <Phone className="h-6 w-6 rotate-[135deg] text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EndedScreen({ call, duration }) {
  return (
    <div className="public-scope fadein grid h-[100dvh] w-full place-items-center bg-black text-center text-white">
      <div>
        <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full ring-2 ring-white/10">
          {call.photo_url ? (
            <img alt="" src={fileUrl(call.photo_url)} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center bg-emerald-800 text-3xl">{call.contact_name?.[0]}</div>
          )}
        </div>
        <p className="text-xl font-medium">{call.contact_name}</p>
        <p className="mt-1 text-sm text-white/60" data-testid="call-ended-text">Chamada encerrada</p>
        <p className="mt-1 text-xs text-white/50">Duração {formatDuration(duration)}</p>
      </div>
    </div>
  );
}

export default function PublicCall() {
  const { callId } = useParams();
  const [call, setCall] = useState(null);
  const [status, setStatus] = useState("loading");
  const [duration, setDuration] = useState(0);
  const startedRef = useRef(0);

  useEffect(() => {
    let mounted = true;
    api.get(`/calls/${callId}`).then((res) => {
      if (!mounted) return;
      setCall(res.data); setStatus("incoming");
    }).catch((err) => {
      if (!mounted) return;
      if (err?.response?.status === 404) setStatus("notfound");
      else setStatus("error");
    });
    return () => { mounted = false; };
  }, [callId]);

  const accept = () => { startedRef.current = Date.now(); setStatus("active"); };
  const decline = () => setStatus("ended");
  const endNow = () => { setDuration(Math.floor((Date.now() - startedRef.current) / 1000)); setStatus("ended"); };
  const naturalEnd = () => { setDuration(Math.floor((Date.now() - startedRef.current) / 1000)); setStatus("ended"); };

  if (status === "loading") return <Loading />;
  if (status === "notfound") return <ErrorScreen title="Chamada não encontrada" subtitle="O link é inválido ou foi removido." />;
  if (status === "error") return <ErrorScreen title="Erro de conexão" subtitle="Não foi possível carregar a chamada." />;
  if (status === "incoming") return <IncomingScreen call={call} onAccept={accept} onDecline={decline} />;
  if (status === "active") return <ActiveCall call={call} onEnded={naturalEnd} onEndClick={endNow} />;
  return <EndedScreen call={call} duration={duration} />;
}
