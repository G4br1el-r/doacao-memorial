/**
 * O que existe no escuro esperando ser iluminado.
 *
 * Sem isso a vela nao teria o que revelar - arrastar num vazio preto nao
 * comunica nada. Sao palavras da missao espalhadas em profundidades
 * diferentes: as mais distantes reagem menos a luz, o que da a sensacao
 * de uma nave de igreja, e nao de um adesivo colado na tela.
 */

type Inscricao = {
  texto: string;
  /* posicao em % do palco */
  x: number;
  y: number;
  /* 0 = fundo distante, 1 = perto da luz */
  profundidade: number;
  tamanho: string;
};

/* espalhadas de proposito pelos dois lados: o doador precisa varrer a tela
   para achar todas, e e essa procura que segura o momento */
export const INSCRICOES: Inscricao[] = [
  {
    texto: "FÉ",
    x: 16,
    y: 26,
    profundidade: 0.9,
    tamanho: "text-5xl sm:text-7xl",
  },
  {
    texto: "CARIDADE",
    x: 76,
    y: 34,
    profundidade: 0.75,
    tamanho: "text-3xl sm:text-5xl",
  },
  {
    texto: "ESPERANÇA",
    x: 30,
    y: 63,
    profundidade: 0.8,
    tamanho: "text-3xl sm:text-5xl",
  },
  {
    texto: "MISSÃO",
    x: 80,
    y: 60,
    profundidade: 0.65,
    tamanho: "text-2xl sm:text-4xl",
  },
  {
    /* fora do rodape central: era o unico lugar onde a mensagem final
       aparece, e as duas se sobrepunham */
    texto: "EVANGELIZAÇÃO",
    x: 20,
    y: 46,
    profundidade: 0.5,
    tamanho: "text-xl sm:text-3xl",
  },
  {
    texto: "ORAÇÃO",
    x: 60,
    y: 16,
    profundidade: 0.55,
    tamanho: "text-2xl sm:text-4xl",
  },
];

export function FundoRevelado() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      {INSCRICOES.map((i) => (
        <span
          key={i.texto}
          className={`absolute -translate-x-1/2 -translate-y-1/2 font-serif tracking-[0.2em] text-[#d9c9a3] ${i.tamanho}`}
          style={{
            left: `${i.x}%`,
            top: `${i.y}%`,
            /* o que esta longe da luz aparece mais fraco mesmo quando
               iluminado - e o que cria a nave de igreja */
            opacity: 0.16 + i.profundidade * 0.5,
          }}
        >
          {i.texto}
        </span>
      ))}

      {/* arcos de pedra ao fundo: dao arquitetura ao escuro sem competir
          com as palavras */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.13]"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <title>Arcos</title>
        <g stroke="#d9c9a3" strokeWidth="1.6" fill="none">
          <path d="M120 600 L120 300 Q120 210 200 210 Q280 210 280 300 L280 600" />
          <path d="M360 600 L360 250 Q360 145 460 145 Q560 145 560 250 L560 600" />
          <path d="M640 600 L640 300 Q640 210 720 210 Q800 210 800 300 L800 600" />
          <path d="M860 600 L860 340 Q860 270 915 270 Q970 270 970 340 L970 600" />
        </g>
      </svg>
    </div>
  );
}
