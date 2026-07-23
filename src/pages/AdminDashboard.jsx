import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, Copy, ExternalLink, Trash2, Video, Phone, UploadCloud, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { api, clearToken, fileUrl } from "@/lib/api";

const STATUS_OPTIONS = ["Chamando...", "Conectando...", "Tocando...", "Chamando pelo WhatsApp..."];

function CallCard({ call, onDelete }) {
  const shareUrl = `${window.location.origin}/call/${call.id}`;
  const copy = async () => {
    try { await navigator.clipboard.writeText(shareUrl); toast.success("Link copiado!"); }
    catch { toast.error("Não foi possível copiar"); }
  };
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1A1D24]/80 p-5 transition hover:border-emerald-400/40" data-testid={`call-card-${call.id}`}>
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10">
          {call.photo_path ? (
            <img alt="" src={fileUrl(`/api/files/${call.photo_path}`)} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full w-full place-items-center text-slate-500"><ImageIcon className="h-6 w-6" /></div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium">{call.contact_name}</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-slate-300">
              {call.call_type === "video" ? <Video className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
              {call.call_type}
            </span>
          </div>
          <p className="truncate text-xs text-slate-400">{call.status_text}</p>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-white/5 bg-black/30 px-3 py-2 text-xs text-slate-300">
        <span className="truncate block">{shareUrl}</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Button size="sm" onClick={copy} className="bg-emerald-500 hover:bg-emerald-400 text-white" data-testid={`copy-link-${call.id}`}>
          <Copy className="mr-1.5 h-3.5 w-3.5" /> Copiar
        </Button>
        <a href={shareUrl} target="_blank" rel="noreferrer">
          <Button size="sm" variant="secondary" className="bg-white/5 hover:bg-white/10 text-slate-100 border border-white/10" data-testid={`open-link-${call.id}`}>
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Abrir
          </Button>
        </a>
        <Button size="sm" variant="ghost" onClick={() => onDelete(call.id)} className="ml-auto text-red-400 hover:bg-red-500/10 hover:text-red-300" data-testid={`delete-call-${call.id}`}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function CreateCallDialog({ open, onOpenChange, onCreated }) {
  const [name, setName] = useState("");
  const [callType, setCallType] = useState("video");
  const [statusText, setStatusText] = useState("Chamando...");
  const [videoFile, setVideoFile] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [videoPath, setVideoPath] = useState("");
  const [photoPath, setPhotoPath] = useState("");
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const reset = () => {
    setName(""); setCallType("video"); setStatusText("Chamando...");
    setVideoFile(null); setPhotoFile(null); setVideoPath(""); setPhotoPath("");
  };

  const uploadFile = async (file, kind) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post(`/admin/upload?kind=${kind}`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data.path;
  };

  const handleVideo = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    setVideoFile(f); setUploadingVideo(true);
    try { const path = await uploadFile(f, "video"); setVideoPath(path); toast.success("Vídeo enviado"); }
    catch (err) { toast.error(err?.response?.data?.detail || "Falha no upload do vídeo"); setVideoFile(null); }
    finally { setUploadingVideo(false); }
  };

  const handlePhoto = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    setPhotoFile(f); setUploadingPhoto(true);
    try { const path = await uploadFile(f, "photo"); setPhotoPath(path); toast.success("Foto enviada"); }
    catch (err) { toast.error(err?.response?.data?.detail || "Falha no upload da foto"); setPhotoFile(null); }
    finally { setUploadingPhoto(false); }
  };

  const submit = async () => {
    if (!name.trim()) return toast.error("Informe o nome do contato");
    if (!videoPath) return toast.error("Envie um vídeo");
    setSubmitting(true);
    try {
      const res = await api.post("/admin/calls", {
        contact_name: name.trim(),
        photo_path: photoPath || null,
        video_path: videoPath,
        call_type: callType,
        status_text: statusText,
      });
      toast.success("Chamada criada!");
      onCreated(res.data); reset(); onOpenChange(false);
    } catch (err) { toast.error(err?.response?.data?.detail || "Erro ao criar chamada"); }
    finally { setSubmitting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="max-w-lg border-white/10 bg-[#1A1D24] text-slate-100" data-testid="create-call-dialog">
        <DialogHeader><DialogTitle className="font-display text-xl">Nova chamada</DialogTitle></DialogHeader>
        <div className="space-y-5">
          <div>
            <Label className="text-slate-300">Nome do contato</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Ana Souza" className="mt-1.5 border-white/10 bg-black/30" data-testid="input-contact-name" />
          </div>
          <div>
            <Label className="text-slate-300">Vídeo (MP4, MOV, WebM)</Label>
            <label className="mt-1.5 flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-white/15 bg-black/30 px-4 py-4 text-sm text-slate-300 hover:border-emerald-400/40">
              <span className="flex items-center gap-2">
                {uploadingVideo ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
                {videoFile ? videoFile.name : "Selecionar vídeo"}
              </span>
              {videoPath && <span className="text-xs text-emerald-400">✓ enviado</span>}
              <input type="file" accept="video/mp4,video/quicktime,video/webm,video/x-m4v" onChange={handleVideo} className="hidden" data-testid="input-video-file" />
            </label>
          </div>
          <div>
            <Label className="text-slate-300">Foto de perfil (opcional)</Label>
            <label className="mt-1.5 flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-white/15 bg-black/30 px-4 py-4 text-sm text-slate-300 hover:border-emerald-400/40">
              <span className="flex items-center gap-2">
                {uploadingPhoto ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                {photoFile ? photoFile.name : "Selecionar foto"}
              </span>
              {photoPath && <span className="text-xs text-emerald-400">✓ enviado</span>}
              <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" data-testid="input-photo-file" />
            </label>
          </div>
          <div>
            <Label className="text-slate-300">Tipo de chamada</Label>
            <RadioGroup value={callType} onValueChange={setCallType} className="mt-2 grid grid-cols-2 gap-2">
              <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 ${callType === "video" ? "border-emerald-400/60 bg-emerald-500/10" : "border-white/10 bg-black/30"}`}>
                <RadioGroupItem value="video" data-testid="radio-type-video" /> <Video className="h-4 w-4" /> Vídeo
              </label>
              <label className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 ${callType === "voice" ? "border-emerald-400/60 bg-emerald-500/10" : "border-white/10 bg-black/30"}`}>
                <RadioGroupItem value="voice" data-testid="radio-type-voice" /> <Phone className="h-4 w-4" /> Voz
              </label>
            </RadioGroup>
          </div>
          <div>
            <Label className="text-slate-300">Status exibido</Label>
            <Select value={statusText} onValueChange={setStatusText}>
              <SelectTrigger className="mt-1.5 border-white/10 bg-black/30" data-testid="select-status"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-[#1A1D24] text-slate-100 border-white/10">
                {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={submit} disabled={submitting || uploadingVideo || uploadingPhoto} className="w-full rounded-full bg-emerald-500 hover:bg-emerald-400 text-white h-11" data-testid="submit-create-call">
            {submitting ? "Criando..." : "Gerar chamada"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminDashboard() {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const res = await api.get("/admin/calls");
      setCalls(res.data);
    } catch (err) {
      if (err?.response?.status === 401) { clearToken(); navigate("/admin"); }
      else toast.error("Erro ao carregar chamadas");
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const logout = () => { clearToken(); navigate("/admin"); };
  const del = async (id) => {
    if (!window.confirm("Excluir esta chamada?")) return;
    try { await api.delete(`/admin/calls/${id}`); setCalls((c) => c.filter((x) => x.id !== id)); toast.success("Chamada excluída"); }
    catch { toast.error("Falha ao excluir"); }
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0B0E14]/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Painel</p>
            <h1 className="font-display text-2xl font-semibold tracking-tight">WhatsCall Admin</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setOpen(true)} className="rounded-full bg-emerald-500 hover:bg-emerald-400 text-white" data-testid="new-call-button">
              <Plus className="mr-1.5 h-4 w-4" /> Nova chamada
            </Button>
            <Button onClick={logout} variant="ghost" className="text-slate-300 hover:bg-white/5" data-testid="logout-button">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        {loading ? (
          <div className="grid place-items-center py-24 text-slate-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : calls.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/40">
              <Video className="h-7 w-7 text-emerald-400" />
            </div>
            <p className="font-display text-xl">Nenhuma chamada ainda</p>
            <p className="mt-1 text-sm text-slate-400">Crie sua primeira simulação em segundos.</p>
            <Button onClick={() => setOpen(true)} className="mt-5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white" data-testid="empty-create-button">
              <Plus className="mr-1.5 h-4 w-4" /> Criar chamada
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calls.map((c) => <CallCard key={c.id} call={c} onDelete={del} />)}
          </div>
        )}
      </main>

      <CreateCallDialog open={open} onOpenChange={setOpen} onCreated={(c) => setCalls((prev) => [c, ...prev])} />
    </div>
  );
}
