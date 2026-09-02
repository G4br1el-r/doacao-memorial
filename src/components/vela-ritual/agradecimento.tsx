"use client";

import { Check, Flame } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * O respiro entre a doacao e o ritual.
 *
 * Ocupa o lugar do formulario assim que ele sai: o doador precisa de um
 * reconhecimento antes de qualquer outra coisa, e a vela vira um convite
 * que ele aceita - nao uma tela que aparece sozinha.
 */

const SUAVE = [0.22, 1, 0.36, 1] as const;

/* tempos da simulacao de cobranca. na versao real quem troca de estado e
   a resposta do gateway - aqui e so o relogio */
const MS_PROCESSANDO = 2600;
const MS_ATE_CONTEUDO = 1100;

type Estado = "processando" | "confirmado" | "pronto";

/* anel dourado com um arco girando por cima - o mesmo dourado do site,
   em vez de um spinner de biblioteca que destoaria de tudo */
function Selo({ confirmado }: { confirmado: boolean }) {
  return (
    <div className="relative flex h-28 w-28 items-center justify-center">
      {/* trilho parado */}
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <title>Processando</title>
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#d9c9a3"
          strokeOpacity="0.16"
          strokeWidth="2.5"
        />
        {/* o arco que gira: some quando confirma, dando lugar ao anel
            cheio que se fecha */}
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#d9c9a3"
          strokeWidth="2.5"
          strokeLinecap="round"
          /* 1/4 da volta visivel - o resto do tracejado fica vazio */
          strokeDasharray="70 210"
          animate={{
            rotate: confirmado ? 360 : [0, 360],
            opacity: confirmado ? 0 : 1,
          }}
          transition={{
            rotate: confirmado
              ? { duration: 0.6, ease: SUAVE }
              : {
                  duration: 1.15,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
            opacity: { duration: 0.4 },
          }}
          style={{ transformOrigin: "50% 50%" }}
        />
        {/* o anel completo se desenhando na confirmacao */}
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#e8dcc0"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength={1}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: confirmado ? 1 : 0 }}
          transition={{ duration: 0.9, ease: SUAVE }}
          /* comeca no topo, como um relogio */
          style={{ transformOrigin: "50% 50%", rotate: -90 }}
        />
      </svg>

      {/* miolo: brilho pulsando enquanto processa, check quando confirma */}
      <AnimatePresence mode="wait">
        {confirmado ? (
          <motion.span
            key="check"
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.35, ease: SUAVE }}
          >
            <Check className="h-11 w-11 text-[#e8dcc0]" strokeWidth={1.6} />
          </motion.span>
        ) : (
          <motion.span
            key="brilho"
            className="h-3 w-3 rounded-full bg-[#d9c9a3]"
            exit={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.15, 0.85] }}
            transition={{
              duration: 1.6,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )}
      </AnimatePresence>

      {/* halo quente por tras do selo confirmado */}
      <motion.div
        className="pointer-events-none absolute inset-0 -z-10 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(217,201,163,0.22), transparent 68%)",
        }}
        animate={{
          opacity: confirmado ? 1 : 0.35,
          scale: confirmado ? 1.3 : 1,
        }}
        transition={{ duration: 1.2, ease: SUAVE }}
      />
    </div>
  );
}

interface AgradecimentoProps {
  onAcenderVela: () => void;
  nome?: string;
  valor?: string;
  /* ja confirmou antes? entao pula a simulacao: o doador esta voltando
     do ritual, e ver o spinner de novo faria parecer que a doacao
     nao tinha sido registrada */
  jaConfirmado?: boolean;
  onConfirmado?: () => void;
}

export function Agradecimento({
  onAcenderVela,
  nome,
  valor,
  jaConfirmado,
  onConfirmado,
}: AgradecimentoProps) {
  const [estado, setEstado] = useState<Estado>(
    jaConfirmado ? "pronto" : "processando",
  );

  /* processando -> confirmado -> pronto. na versao real o primeiro salto
     vem do webhook do gateway; o segundo e so o tempo de ler o check */
  useEffect(() => {
    if (jaConfirmado) return;

    const aoConfirmar = setTimeout(
      () => setEstado("confirmado"),
      MS_PROCESSANDO,
    );
    const aoLiberar = setTimeout(() => {
      setEstado("pronto");
      /* avisa o pai para nao repetir a simulacao numa proxima montagem */
      onConfirmado?.();
    }, MS_PROCESSANDO + MS_ATE_CONTEUDO);

    return () => {
      clearTimeout(aoConfirmar);
      clearTimeout(aoLiberar);
    };
  }, [jaConfirmado, onConfirmado]);

  /* so o primeiro nome: o texto e uma fala, nao um cadastro */
  const primeiroNome = nome?.trim().split(/\s+/)[0];
  const confirmado = estado !== "processando";

  return (
    <motion.div
      /* rola por dentro se a tela for baixa: o card herda o teto de
         altura do contentor do formulario */
      className="flex min-h-0 flex-col items-center overflow-y-auto rounded-2xl border border-[#d9c9a3]/20 bg-black/55 px-8 py-12 text-center shadow-xl backdrop-blur-xl [scrollbar-color:rgba(217,201,163,0.35)_transparent] [scrollbar-width:thin]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: SUAVE }}
    >
      <Selo confirmado={confirmado} />

      {/* o rotulo do que esta acontecendo, trocando no lugar */}
      <div className="mt-6 h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={confirmado ? "ok" : "processando"}
            className="text-[11px] tracking-[0.25em] text-[#d9c9a3]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: SUAVE }}
          >
            {confirmado ? "DOAÇÃO CONFIRMADA" : "PROCESSANDO"}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* o agradecimento so entra depois do check: antes disso o doador
          ainda nao sabe se deu certo */}
      <AnimatePresence>
        {estado === "pronto" && (
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: SUAVE }}
          >
            <h2 className="mt-6 font-serif text-4xl font-medium leading-tight text-[#e8dcc0] sm:text-5xl">
              {primeiroNome ? `Obrigado, ${primeiroNome}.` : "Obrigado."}
            </h2>

            <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/75">
              {valor ? (
                <>
                  Sua doação de <span className="text-[#e8dcc0]">{valor}</span>{" "}
                  foi recebida. Ela sustenta a missão de fé, evangelização e
                  caridade que segue viva por aqui.
                </>
              ) : (
                <>
                  Sua doação foi recebida. Ela sustenta a missão de fé,
                  evangelização e caridade que segue viva por aqui.
                </>
              )}
            </p>

            <motion.div
              className="mt-8 h-px w-24 bg-linear-to-r from-transparent via-[#d9c9a3]/60 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.4, ease: SUAVE }}
            />

            <motion.p
              className="mt-8 text-[13px] leading-relaxed text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.7, ease: SUAVE }}
            >
              Antes de ir, acenda uma vela pela sua intenção.
            </motion.p>

            <motion.button
              type="button"
              onClick={onAcenderVela}
              className="group mt-5 flex items-center gap-3 rounded-lg bg-linear-to-r from-[#c9b184] via-[#f0e2c0] to-[#c9b184] px-8 py-3.5 text-[13px] font-semibold tracking-[0.15em] text-black transition-opacity hover:opacity-90"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9, ease: SUAVE }}
            >
              <Flame className="h-4 w-4 transition-transform group-hover:scale-110" />
              ACENDER UMA VELA
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
