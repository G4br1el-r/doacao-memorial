"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Chama } from "./chama";
import { FundoRevelado } from "./fundo-revelado";
import { Vela } from "./vela";

/**
 * O ritual: a tela apaga por completo, uma unica chama arde no centro, e
 * o doador toca na vela para acende-la. A chama-fonte entao se apaga - a
 * luz passou para ele - e a vela vira a unica fonte de luz da tela, que
 * ele arrasta livremente para descobrir o que o escuro esconde.
 *
 * A ordem importa: acender e um toque (simples, nao tem como errar) e
 * arrastar e a recompensa, nao o obstaculo. Enquanto explora, ele fica.
 */

const SUAVE = [0.22, 1, 0.36, 1] as const;

const DIAS_ACESA = 7;

/* raio do halo da vela, em px. o valor treme em volta desta base para
   acompanhar a chama - luz de fogo nunca e constante */
const RAIO_LUZ = 460;

type Fase = "fechado" | "escurecendo" | "convite" | "acendendo" | "livre";

interface VelaRitualProps {
  aberto: boolean;
  onFechar: () => void;
  /* nome de quem doou, se houver - entra na mensagem final */
  nome?: string;
}

export function VelaRitual({ aberto, onFechar, nome }: VelaRitualProps) {
  const [fase, setFase] = useState<Fase>("fechado");
  /* no desktop a vela gruda no ponteiro; um clique solta para o doador
     poder parar e ler. no toque isso nao existe - la ele arrasta */
  const [presaAoPonteiro, setPresaAoPonteiro] = useState(false);
  const [ehToque, setEhToque] = useState(false);

  const velaRef = useRef<HTMLDivElement>(null);

  /* deslocamento da vela a partir do centro do palco */
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  /* a mao humana nao e firme: a mola faz a luz chegar um instante depois
     do dedo, o que da peso ao objeto */
  const xSuave = useSpring(x, { stiffness: 220, damping: 24, mass: 0.7 });
  const ySuave = useSpring(y, { stiffness: 220, damping: 24, mass: 0.7 });

  /* a vela pende para o lado do movimento */
  const rotacao = useTransform(xSuave, [-500, 500], [-11, 11]);

  /* o halo pulsa sozinho: sem isso a luz parece lanterna, nao fogo */
  const tremor = useMotionValue(RAIO_LUZ);

  useEffect(() => {
    if (fase !== "livre") return;

    let frame = 0;
    const inicio = performance.now();

    const pulsar = (ts: number) => {
      const t = (ts - inicio) / 1000;
      /* duas ondas de periodo incompativel: o tremor nunca se repete */
      const variacao = Math.sin(t * 2.3) * 20 + Math.sin(t * 5.7) * 10;
      tremor.set(RAIO_LUZ + variacao);
      frame = requestAnimationFrame(pulsar);
    };
    frame = requestAnimationFrame(pulsar);

    return () => cancelAnimationFrame(frame);
  }, [fase, tremor]);

  /* a mascara: um buraco redondo de luz que segue a vela. o centro da
     luz fica na altura do pavio, nao no meio do corpo da vela */
  const luzX = useTransform(xSuave, (v) => `calc(50% + ${v}px)`);
  const luzY = useTransform(ySuave, (v) => `calc(50% + ${v - 70}px)`);
  const mascara = useMotionTemplate`radial-gradient(circle ${tremor}px at ${luzX} ${luzY}, transparent 0%, transparent 22%, rgba(0,0,0,0.55) 48%, #000 78%)`;

  /* o mesmo circulo, agora como luz quente somada por cima do escuro.
     declarado aqui em cima porque hook nao pode nascer dentro de JSX
     condicional */
  const halo = useMotionTemplate`radial-gradient(circle ${tremor}px at ${luzX} ${luzY}, rgba(255,176,80,0.17), rgba(255,140,40,0.06) 45%, transparent 72%)`;

  /* ---------- abertura ---------- */
  useEffect(() => {
    if (!aberto) {
      setFase("fechado");
      setPresaAoPonteiro(false);
      setEhToque(false);
      x.set(0);
      y.set(0);
      return;
    }

    setFase("escurecendo");
    /* uma batida curta de escuro antes da chama - o suficiente para
       separar do formulario sem deixar o doador esperando */
    const t = setTimeout(() => setFase("convite"), 700);
    return () => clearTimeout(t);
  }, [aberto, x, y]);

  /* ---------- a vela segue o ponteiro (desktop) ----------
     move `x`/`y` direto no evento em vez de guardar em estado: um
     setState por movimento do mouse re-renderizaria a arvore inteira
     dezenas de vezes por segundo. a mola cuida da suavizacao. */
  useEffect(() => {
    if (fase !== "livre" || !presaAoPonteiro || ehToque) return;

    const seguir = (e: PointerEvent) => {
      /* o palco ocupa a viewport toda, entao o centro dela e a origem */
      x.set(e.clientX - window.innerWidth / 2);
      y.set(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener("pointermove", seguir);
    return () => window.removeEventListener("pointermove", seguir);
  }, [fase, presaAoPonteiro, ehToque, x, y]);

  /* `acender` nasce de novo a cada render; guardar numa ref deixa o
     listener de teclado estavel sem ficar lendo uma versao velha */
  const acenderRef = useRef(acender);
  acenderRef.current = acender;

  /* ---------- ESC fecha ---------- */
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onFechar();
        return;
      }
      /* quem navega pelo teclado tambem precisa acender: sem isso o
         ritual seria intransponivel sem mouse */
      if ((e.key === "Enter" || e.key === " ") && fase === "convite") {
        e.preventDefault();
        acenderRef.current(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto, onFechar, fase]);

  /* a vela sobe ate a chama, acende, e a chama-fonte se apaga */
  function acender(porToque: boolean) {
    if (fase !== "convite") return;
    setEhToque(porToque);
    setFase("acendendo");
    /* no desktop ela ja sai grudada: o doador acabou de clicar, a mao
       esta no mouse, e o movimento seguinte ja ilumina */
    if (!porToque) setPresaAoPonteiro(true);
    /* so o instante do pavio pegando fogo - a vela assume a luz quase
       de imediato para a mao nao ficar esperando */
    setTimeout(() => setFase("livre"), 260);
  }

  const dataFinal = new Date(
    Date.now() + DIAS_ACESA * 86400000,
  ).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

  const acesa = fase === "acendendo" || fase === "livre";

  return (
    <AnimatePresence>
      {aberto && (
        <motion.div
          className={cn(
            "fixed inset-0 z-[100] overflow-hidden bg-black",
            /* enquanto a vela e o ponteiro, a setinha some da tela toda -
               senao ela reapareceria assim que saisse de cima da cera */
            presaAoPonteiro && "cursor-none",
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: SUAVE }}
          role="dialog"
          aria-modal="true"
          aria-label="Acenda sua vela"
          /* o clique que solta e retoma a vela vive no palco, nao nela:
             solta, a vela fica parada onde estava, e cacar ela com o
             mouse para retomar seria um estorvo. clicar em qualquer
             lugar resolve. */
          onClick={(e) => {
            if (fase !== "livre" || ehToque) return;
            /* deixa passar o clique nos controles */
            if ((e.target as HTMLElement).closest("button")) return;
            setPresaAoPonteiro((presa) => !presa);
          }}
        >
          {/* ---------- o que o escuro esconde ---------- */}
          <FundoRevelado />

          {/* ---------- o escuro, furado pela luz da vela ----------
              o preto cobre o fundo inteiro e a mascara abre um buraco
              onde a vela esta. antes de acender nao ha buraco: a tela
              e solida, e so a chama-fonte se ve. */}
          <motion.div
            className="absolute inset-0 bg-black"
            style={{
              maskImage: fase === "livre" ? mascara : undefined,
              WebkitMaskImage: fase === "livre" ? mascara : undefined,
            }}
            initial={{ opacity: 1 }}
            animate={{ opacity: fase === "livre" ? 0.94 : 1 }}
            transition={{ duration: 1.6, ease: SUAVE }}
          />

          {/* halo quente que a vela joga no ambiente - por cima do escuro,
              some junto com ele nas beiradas */}
          {fase === "livre" && (
            <motion.div
              className="pointer-events-none absolute inset-0"
              style={{ background: halo }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8, ease: SUAVE }}
            />
          )}

          {/* ---------- chama-fonte ---------- */}
          <AnimatePresence>
            {(fase === "convite" || fase === "acendendo") && (
              <motion.div
                className="pointer-events-none absolute left-1/2 top-[26%] h-24 w-24 -translate-x-1/2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                /* apaga no ato: a luz passou para a vela, e qualquer
                   sobra dela concorreria com o halo que o doador acabou
                   de ganhar */
                exit={{
                  opacity: 0,
                  scale: 0.3,
                  transition: { duration: 0.22, ease: "easeOut" },
                }}
                /* sem delay: nasce junto com a vela, nao depois dela */
                transition={{ duration: 0.9, ease: SUAVE }}
              >
                <Chama ativa tamanho={0.62} agitacao={0.42} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------- convite ---------- */}
          <AnimatePresence>
            {fase === "convite" && (
              <motion.p
                className="absolute left-1/2 top-[46%] z-10 -translate-x-1/2 px-8 text-center font-serif text-xl font-medium text-[#e8dcc0] sm:text-3xl"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                /* um respiro depois da vela, so para o olho pousar nela
                   primeiro e ler a frase em seguida */
                transition={{ duration: 0.9, delay: 0.45, ease: SUAVE }}
              >
                Toque na vela para acendê-la.
              </motion.p>
            )}
          </AnimatePresence>

          {/* ---------- a vela ---------- */}
          <motion.div
            ref={velaRef}
            /* sem `top` no className: o motion e o dono da posicao vertical.
               fixar top-1/2 aqui fazia a vela nascer no centro e so depois
               escorregar para baixo, entregando a animacao */
            className="absolute left-1/2 z-20 h-56 w-32 touch-none sm:h-64 sm:w-36"
            style={{
              x: xSuave,
              y: ySuave,
              rotate: rotacao,
              /* o translate de centralizacao entra aqui porque `x`/`y` ja
                 ocupam a transform do motion */
              translateX: "-50%",
              translateY: "-50%",
            }}
            /* antes de acender ela espera embaixo; acesa, sobe ao centro */
            animate={{
              top: fase === "convite" ? "70%" : "52%",
              scale: acesa ? 1.05 : 1,
              opacity: fase === "escurecendo" ? 0 : 1,
            }}
            /* nasce parada no lugar de baixo: so a opacidade entra */
            initial={{ top: "70%", opacity: 0 }}
            transition={{
              duration: 1.9,
              ease: SUAVE,
              opacity: { duration: 0.9, ease: SUAVE },
            }}
            /* arrastar so no toque: no desktop ela segue o ponteiro, e
               ter os dois ao mesmo tempo faria o drag brigar com o
               rastreamento */
            drag={fase === "livre" && ehToque}
            dragMomentum={false}
            dragElastic={0.08}
            onTap={(e) => {
              /* `pointerType` distingue dedo de mouse: e o que decide se
                 esta tela vai grudar no ponteiro ou arrastar */
              const porToque =
                (e as PointerEvent).pointerType === "touch" ||
                (e as PointerEvent).pointerType === "pen";

              if (fase === "convite") acender(porToque);
            }}
            whileDrag={{ cursor: "grabbing" }}
          >
            {/* pulso convidando o toque */}
            {fase === "convite" && (
              <motion.div
                className="pointer-events-none absolute inset-0 -z-10 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(217,201,163,0.20), transparent 62%)",
                }}
                animate={{
                  opacity: [0.25, 0.8, 0.25],
                  scale: [0.9, 1.14, 0.9],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            )}

            <Vela
              acesa={acesa}
              className={cn(
                "h-full w-full",
                fase === "convite" && "cursor-pointer",
                /* grudada, a propria vela e o ponteiro: mostrar a setinha
                   junto quebraria a ilusao */
                fase === "livre" && presaAoPonteiro && "cursor-none",
                fase === "livre" && !presaAoPonteiro && "cursor-pointer",
              )}
            />
          </motion.div>

          {/* ---------- dica de revelar: fica enquanto a vela arde ---------- */}
          <AnimatePresence>
            {fase === "livre" && (
              <motion.p
                /* no topo, nao embaixo: a mensagem final cresce a partir
                   do rodape e em tela baixa as duas se encontrariam */
                className="absolute top-10 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-[12px] tracking-[0.2em] text-[#e8dcc0]"
                initial={{ opacity: 0 }}
                /* respira devagar em vez de piscar: a frase mora na tela
                   agora, e um pisca-pisca constante cansaria */
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 4.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  /* chega antes do texto dos 7 dias: primeiro o doador
                     descobre que pode explorar, depois recebe a conclusao */
                  delay: 0.5,
                }}
              >
                {ehToque
                  ? "ARRASTE A VELA PARA ILUMINAR"
                  : "MOVA O MOUSE PARA ILUMINAR"}
              </motion.p>
            )}
          </AnimatePresence>

          {/* ---------- mensagem e saida ---------- */}
          <AnimatePresence>
            {fase === "livre" && (
              <motion.div
                /* cursor de volta aqui: o botao precisa parecer clicavel
                   mesmo com a vela grudada no ponteiro */
                className="absolute inset-x-0 bottom-8 z-30 flex cursor-default flex-col items-center px-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                /* deixa a instrucao respirar sozinha antes de entregar o
                   fecho - senao os dois textos disputam o mesmo instante */
                transition={{ duration: 1.4, delay: 5.4, ease: SUAVE }}
              >
                <p className="font-serif text-2xl font-medium leading-snug text-[#e8dcc0] sm:text-3xl">
                  {nome
                    ? `Sua vela está acesa, ${nome}.`
                    : "Sua vela está acesa."}
                </p>
                <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/70">
                  Ela permanecerá acesa por {DIAS_ACESA} dias, até {dataFinal},
                  e será lembrada nas intenções da missão.
                </p>

                <motion.button
                  type="button"
                  onClick={onFechar}
                  className="mt-6 rounded-lg border border-[#d9c9a3]/40 px-8 py-2.5 text-[12px] tracking-[0.2em] text-[#e8dcc0] transition-colors hover:border-[#d9c9a3]/80 hover:bg-[#d9c9a3]/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 6.4 }}
                >
                  FINALIZAR
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
