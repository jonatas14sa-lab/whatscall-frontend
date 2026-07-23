import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { api, setToken } from "@/lib/api";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    try {
      const res = await api.post("/admin/login", { password });
      setToken(res.data.token);
      toast.success("Bem-vindo ao painel");
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Falha ao entrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B0E14] px-6 grain">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl" />
      <form onSubmit={handleSubmit} className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#1A1D24]/80 p-8 backdrop-blur-xl" data-testid="admin-login-form">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-400/40">
            <Lock className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">Painel WhatsCall</h1>
            <p className="text-sm text-slate-400">Acesso restrito.</p>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="pwd" className="text-slate-300">Senha</Label>
          <Input id="pwd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Digite sua senha" className="border-white/10 bg-black/30 text-slate-100 placeholder:text-slate-500" data-testid="admin-login-password" autoFocus />
        </div>
        <Button type="submit" disabled={loading} className="mt-6 h-11 w-full rounded-full bg-emerald-500 text-white hover:bg-emerald-400" data-testid="admin-login-submit">
          {loading ? "Entrando..." : (<>Entrar <ArrowRight className="ml-2 h-4 w-4" /></>)}
        </Button>
        <p className="mt-4 text-center text-xs text-slate-500">Senha padrão inicial: <code className="text-slate-300">admin123</code></p>
      </form>
    </div>
  );
}
