import { Link } from "react-router-dom";
import { PhoneIncoming, Video, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B0E14] text-slate-100 grain">
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <header className="relative z-10 flex items-center justify-between px-6 py-6 md:px-14">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-400/40">
            <PhoneIncoming className="h-5 w-5 text-emerald-400" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight">WhatsCall</span>
        </div>
        <Link to="/admin" data-testid="landing-open-admin">
          <Button variant="secondary" className="bg-white/5 hover:bg-white/10 text-slate-100 border border-white/10">
            Acessar Painel <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pb-24 pt-10 md:grid-cols-2 md:gap-16 md:px-14 md:pt-20">
        <section className="flex flex-col justify-center">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" /> Simulador realista de chamada
          </span>
          <h1 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Uma chamada de vídeo <span className="text-emerald-400">quase real</span>, com o seu roteiro.
          </h1>
          <p className="mt-5 max-w-xl text-base text-slate-300 md:text-lg">
            Faça upload de um vídeo, escolha o contato e envie um link. Quem abrir, verá uma tela idêntica a uma
            chamada recebida — atende, o vídeo toca, a duração é exatamente a do vídeo.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/admin" data-testid="landing-cta-start">
              <Button className="h-11 rounded-full bg-emerald-500 px-6 text-white hover:bg-emerald-400">
                Criar nova chamada <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <a href="#como-funciona">
              <Button variant="ghost" className="h-11 rounded-full text-slate-200 hover:bg-white/5">Como funciona</Button>
            </a>
          </div>
          <ul id="como-funciona" className="mt-10 grid grid-cols-1 gap-3 text-sm text-slate-300 sm:grid-cols-3">
            <li className="rounded-xl border border-white/10 bg-white/5 p-4">
              <span className="mb-1 block text-xs uppercase tracking-wider text-emerald-400">1</span>
              Envie seu vídeo (MP4, MOV, WebM)
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-4">
              <span className="mb-1 block text-xs uppercase tracking-wider text-emerald-400">2</span>
              Configure nome, foto e tipo
            </li>
            <li className="rounded-xl border border-white/10 bg-white/5 p-4">
              <span className="mb-1 block text-xs uppercase tracking-wider text-emerald-400">3</span>
              Compartilhe o link único
            </li>
          </ul>
        </section>

        <section className="relative flex items-center justify-center">
          <div className="relative h-[560px] w-[280px] rounded-[44px] border border-white/10 bg-[#0B141A] p-3 shadow-2xl shadow-emerald-500/10">
            <div className="absolute left-1/2 top-2 z-20 h-5 w-24 -translate-x-1/2 rounded-full bg-black" />
            <div className="relative h-full w-full overflow-hidden rounded-[36px] bg-gradient-to-b from-[#0B141A] via-[#111B21] to-[#0B141A]">
              <div className="absolute inset-x-0 top-10 flex flex-col items-center text-center">
                <p className="text-[11px] uppercase tracking-widest text-slate-400">WhatsApp • Vídeo</p>
                <p className="mt-1 text-xs text-slate-300">Chamando...</p>
              </div>
              <div className="absolute inset-x-0 top-28 flex flex-col items-center">
                <div className="relative">
                  <span className="absolute inset-0 -z-10 rounded-full bg-emerald-500/30 pulse-ring" />
                  <span className="absolute inset-0 -z-10 rounded-full bg-emerald-500/25 pulse-ring-delayed" />
                  <div className="soft-bob h-28 w-28 overflow-hidden rounded-full ring-4 ring-white/10">
                    <img alt="preview" src="https://images.unsplash.com/photo-1594672830234-ba4cfe1202dc?w=400&q=80" className="h-full w-full object-cover" />
                  </div>
                </div>
                <p className="mt-6 text-xl font-medium">Ana Souza</p>
                <p className="text-xs text-slate-400">chamada de vídeo</p>
              </div>
              <div className="absolute inset-x-0 bottom-10 flex items-center justify-around px-6">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-red-500 shadow-lg shadow-red-900/40">
                  <Video className="h-6 w-6 rotate-[135deg] text-white" />
                </div>
                <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-500 shadow-lg shadow-emerald-900/40">
                  <Video className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 px-6 py-6 text-center text-xs text-slate-500 md:px-14">
        Uso responsável. Este é um simulador de chamada com fins recreativos.
      </footer>
    </div>
  );
}
