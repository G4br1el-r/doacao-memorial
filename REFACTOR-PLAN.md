# REFACTOR-PLAN

Refatoração estrutural sem mudança de comportamento visual ou funcional.

## 1. Versões detectadas (package.json)

| Pacote | Versão declarada | Versão instalada |
| --- | --- | --- |
| next | 16.3.4 | 16.3.4 |
| react | 19.2.8 | 19.2.8 |
| react-dom | 19.2.8 | 19.2.8 |
| typescript | ^5 | 5.x |
| tailwindcss | ^4 | 4.x |
| motion | ^13.1.1 | 13.1.1 |
| lucide-react | ^1.38.0 | — |
| react-imask | ^7.6.1 | — |
| clsx | ^2.1.1 | — |
| tailwind-merge | ^3.6.0 | — |
| @biomejs/biome | 2.4.2 (dev) | — |
| babel-plugin-react-compiler | 1.0.0 (dev) | — |

Notas de versão relevantes:

- `next.config.ts` tem `reactCompiler: true`. O React Compiler memoiza automaticamente;
  por isso o código atual não usa `useMemo`/`useCallback` e a refatoração mantém esse padrão.
- `LayoutProps<"/">` é o helper global do Next 16 (confirmado em
  `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/layout.md`).
  Mantido.
- `motion` v13 usa o import `motion/react`. Mantido.
- Não há `react-hook-form`, `zod` nem `@hookform/resolvers` instalados.

## 2. Fase 0 — Inventário

### 2.1 Árvore atual

```
src/
  app/
    globals.css                     tokens de fonte + reset de cursor
    layout.tsx                      3 fontes next/font + metadata (Server)
    page.tsx                        864 linhas, "use client" no topo, TUDO
  components/
    landinpage/hero/                (pasta com typo: "landinpage")
      assinatura/index.tsx          SVG animado da assinatura (client)
      background-video/index.tsx    vídeo de fundo com loop boomerang (client)
    vela-ritual/
      index.tsx                     419 linhas, overlay do ritual (client)
      chama.tsx                     chama procedural em canvas (client)
      vela.tsx                      SVG da vela (client)
      fundo-revelado.tsx            inscrições no escuro (sem "use client")
      agradecimento.tsx             card pós-doação + Selo (client)
  lib/utils/
    cn.ts                           clsx + tailwind-merge
    constants.ts                    atributos legados de autoplay do <video>
```

### 2.2 O que cada arquivo renderiza

- `app/layout.tsx` — html/body, variáveis das 3 fontes (Oswald / Inter / Cormorant Garamond), metadata.
- `app/page.tsx` — hero inteiro (background, padre, degradê, assinatura, título, parágrafo) +
  card de doação (formulário completo) + troca formulário↔agradecimento + montagem do `VelaRitual`.
  Contém 12 componentes/helpers locais: `TituloLetras`, `SectionLabel`, `Obrigatorio`, `Field`,
  `FieldMascarado`, `FieldRotulado`, `digitosDe`, `formatarCentavos`, constantes `VALORES`,
  `FORMAS_PAGAMENTO`, `MOLDURA`, `CONTROLE`, `SUAVE`, `itemCard`.
- `assinatura/index.tsx` — SVG com máscara animada faixa a faixa (escrita à mão).
- `background-video/index.tsx` — `<Image>` poster + `<video>` com loop boomerang manual.
- `vela-ritual/index.tsx` — overlay full-screen com máquina de estados de 5 fases.
- `chama.tsx` — canvas 2D com sistema de partículas.
- `vela.tsx` — SVG da vela com gradientes por `useId`.
- `fundo-revelado.tsx` — inscrições posicionadas + SVG de arcos.
- `agradecimento.tsx` — selo animado + texto + CTA da vela.

### 2.3 Onde está `"use client"` hoje e por quê

| Arquivo | Motivo real |
| --- | --- |
| `app/page.tsx` | 12 `useState`, handlers, `motion`, `AnimatePresence`, `MotionConfig` |
| `assinatura/index.tsx` | `motion.svg` / `motion.rect` |
| `background-video/index.tsx` | `useRef`, `useEffect`, `useState`, `useInView` |
| `vela-ritual/index.tsx` | estado, `useMotionValue`, `useSpring`, `useEffect`, eventos |
| `chama.tsx` | `useRef` + `useEffect` com canvas |
| `vela.tsx` | `useId` (não precisaria de client — ver §7) |
| `agradecimento.tsx` | `useState`, `useEffect`, `motion` |
| `fundo-revelado.tsx` | (não tem — já é Server Component) |

### 2.4 Inventário de animações

Biblioteca única: **motion 13.1.1** (`motion/react`). Easing compartilhado `SUAVE = [0.22, 1, 0.36, 1]`,
duplicado em 3 arquivos (`page.tsx`, `vela-ritual/index.tsx`, `agradecimento.tsx`).

Hero (`page.tsx`):

| Elemento | Tipo | Trigger | Valores |
| --- | --- | --- | --- |
| background wrapper | opacity 0→1, scale 1.06→1 | mount | dur 2.4, SUAVE |
| padre (`motion.img`) | opacity 0→1, y 60→0 | mount | dur 1.8, delay 0.3, SUAVE |
| linha "FAÇA PARTE" | opacity 0→1, y 16→0 | mount | dur 1, delay 0.2, SUAVE |
| filete dourado | width 0→80 | mount | dur 1.2, delay 0.6, SUAVE |
| título "De algo" | letra a letra: opacity/y 40/blur 8px | mount | dur 0.9, delay 0.5 + i*0.05, SUAVE |
| título "maior" | idem | mount | dur 0.9, delay 0.85 + i*0.05, SUAVE |
| parágrafo | opacity 0→1, y 20→0 | mount | dur 1.2, delay 1.5, SUAVE |
| card wrapper | opacity 0→1, x 40→0; opacity→0 se ritual aberto | mount + estado `ritualAberto` | dur 1.4, delay 0.8, SUAVE |
| card formulário | stagger container | mount | delayChildren 1.2, staggerChildren 0.14 |
| blocos do card (`itemCard`) | opacity 0→1, y 16→0 | variants do container | dur 0.9, SUAVE |
| saída do formulário | opacity 0, y -16 | `etapa === "obrigado"` | dur 0.5, SUAVE |
| campo "outro valor" | height 0→auto, opacity, marginTop 0→12 | `valor === "outro"` | dur 0.35, SUAVE |
| campo vencimento | height 0→auto, opacity, marginTop 0→12 | pagamento boleto/carnê | dur 0.35, SUAVE |

`MotionConfig reducedMotion="user"` envolve tudo.

Assinatura:

| Elemento | Tipo | Trigger | Valores |
| --- | --- | --- | --- |
| svg | opacity 0→1 | mount | dur 0.5, delay 1.9 (prop `delay`) |
| 19 `motion.rect` da máscara | width 0→(x1-x0+1) | mount | dur 0.2 (`DUR_LETRA`), ease linear, delay acumulado com `PAUSA_PALAVRA` 0.12 e sobreposição `DUR_LETRA * 0.72` |

Vela-ritual:

| Elemento | Tipo | Trigger | Valores |
| --- | --- | --- | --- |
| overlay | opacity 0→1→0 | `aberto` | dur 0.5, SUAVE |
| camada escura | opacity 1→0.94 + maskImage radial | fase `livre` | dur 1.6, SUAVE |
| halo quente | opacity 0→1 | fase `livre` | dur 1.8, SUAVE |
| chama-fonte | opacity/scale 0.5→1; exit scale 0.3 | fases `convite`/`acendendo` | dur 0.9 SUAVE; exit 0.22 easeOut |
| texto do convite | opacity/y 12→0; exit dur 0.5 | fase `convite` | dur 0.9, delay 0.45, SUAVE |
| vela | top 70%→52%, scale 1→1.05, opacity | fase | dur 1.9 SUAVE; opacity dur 0.9 SUAVE |
| pulso de convite | opacity [0.25,0.8,0.25], scale [0.9,1.14,0.9] loop | fase `convite` | dur 3, repeat ∞, easeInOut |
| dica de arrastar | opacity [0.4,0.8,0.4] loop | fase `livre` | dur 4.5, repeat ∞, easeInOut, delay 0.5 |
| bloco final | opacity/y 20→0 | fase `livre` | dur 1.4, delay 5.4, SUAVE |
| botão FINALIZAR | opacity 0→1 | fase `livre` | dur 1.2, delay 6.4 |
| tremor do halo | rAF: `sin(t*2.3)*20 + sin(t*5.7)*10` sobre `RAIO_LUZ` 460 | fase `livre` | contínuo |
| molas x/y | `useSpring` stiffness 220, damping 24, mass 0.7 | pointermove / drag | — |
| rotação | `useTransform(xSuave, [-500,500], [-11,11])` | movimento | — |
| drag | `drag` só no toque, `dragMomentum: false`, `dragElastic: 0.08` | fase `livre` + toque | — |

Agradecimento:

| Elemento | Tipo | Trigger | Valores |
| --- | --- | --- | --- |
| card | opacity/y 24→0 | mount | dur 1.1, SUAVE |
| arco girando | rotate [0,360] loop / 360 ao confirmar; opacity | `confirmado` | loop dur 1.15 linear; confirm dur 0.6 SUAVE; opacity 0.4 |
| anel completo | pathLength 0→1 | `confirmado` | dur 0.9, SUAVE |
| check | opacity/scale 0.3→1 | `confirmado` | dur 0.7, delay 0.35, SUAVE |
| brilho pulsante | opacity [0.3,1,0.3], scale [0.85,1.15,0.85] loop | `!confirmado` | dur 1.6, repeat ∞, easeInOut |
| halo do selo | opacity/scale | `confirmado` | dur 1.2, SUAVE |
| rótulo de estado | opacity/y 6→0, exit y -6 | troca de `confirmado` | dur 0.45, SUAVE |
| conteúdo final | opacity/y 16→0 | `estado === "pronto"` | dur 1, SUAVE |
| filete | scaleX 0→1 | idem | dur 1.2, delay 0.4, SUAVE |
| "Antes de ir…" | opacity 0→1 | idem | dur 1, delay 0.7, SUAVE |
| botão ACENDER | opacity/y 12→0 | idem | dur 1, delay 0.9, SUAVE |

Chama (canvas, não é motion): partículas com `PARTICULAS_POR_FRAME` 3, `SUBIDA_BASE` 1.15,
`NASCIMENTO_LARGURA` 3, sopro por duas senoides (1.7 e 0.63), gradiente térmico por faixa de vida,
`globalCompositeOperation = "lighter"`, DPR limitado a 2, pausa em `document.hidden`,
respeito a `prefers-reduced-motion`.

Vela (CSS transitions inline): `opacity 900ms ease-out` em 3 elementos, `opacity 320ms ease-out` na brasa.

Background video: `transition-opacity duration-700 ease-out` do vídeo sobre o poster.

### 2.5 Lógica manual feita à mão

| Local | O que faz | Decisão |
| --- | --- | --- |
| `page.tsx:digitosDe` | `replace(/\D/g,"")` + tira zeros à esquerda + corta em 11 | **Mantida.** É extração de dígitos crus para o campo "outro valor", não uma máscara de documento. |
| `page.tsx:formatarCentavos` | monta "12,50" a partir de "1250" com `toLocaleString("pt-BR")` | **Mantida.** Já usa `Intl`; a política proíbe instalar lib para formatação de número. |
| `page.tsx:aoDigitarCep` | `replace(/\D/g,"")` para contar 8 dígitos e chamar ViaCEP | **Mantida.** Não é máscara — a máscara já é da `react-imask`. É só a extração para a URL. |
| `page.tsx` máscaras CPF/CNPJ/telefone/CEP | já usam `react-imask` (`IMaskInput`) | Correto, sem mudança. |
| `page.tsx` validação | **não existe validação de CPF hoje** — nenhum dígito verificador, nenhum schema | Ver §7 (Fase 3 não aplicada). |
| `vela-ritual/index.tsx` | `new Date(Date.now() + 7*86400000).toLocaleDateString("pt-BR", …)` | **Mantido.** Já é `Intl`. |
| `background-video` | loop boomerang com `requestAnimationFrame` mexendo em `currentTime` | **Mantido.** Não há API de plataforma para playbackRate negativo. |
| `chama.tsx` | sistema de partículas em canvas | **Mantido** integralmente. |
| `assinatura/index.tsx` | acúmulo de delays em `let t` dentro do render | **Mantido**, extraído para função pura. |

### 2.6 Comentários existentes

Todos os arquivos são densamente comentados em português, e vários carregam informação **não-óbvia**.
A Fase 5 pede a remoção de todos os comentários; os que carregam decisão de projeto ou workaround
estão registrados na §6 do relatório final antes de sair do código.

### 2.7 Árvore de pastas final

```
src/
  app/
    globals.css
    layout.tsx
    page.tsx                                   Server Component
  components/
    landing-page/
      hero/
        index.tsx                              Server
        hero-background.tsx                    fade+scale do fundo
        hero-priest.tsx                        imagem do padre
        hero-gradient.tsx                      degradê
        hero-signature/                        (era assinatura/)
          index.tsx
          signature-mask.tsx
          signature-paths.ts
          constants.ts
        hero-copy/
          index.tsx
          hero-eyebrow.tsx
          hero-title.tsx
          animated-title.tsx
          hero-tagline.tsx
          constants.ts
        background-video/
          index.tsx
          use-video-autoplay.ts
          use-boomerang-loop.ts
          constants.ts
      donation-card/
        index.tsx                              casca client (estado do fluxo)
        donation-form.tsx
        form-header.tsx
        personal-data-section.tsx
        address-section.tsx
        donation-type-section.tsx
        donation-type-option.tsx
        amount-section.tsx
        amount-option.tsx
        custom-amount-field.tsx
        payment-section.tsx
        payment-option.tsx
        due-date-field.tsx
        policy-checkbox.tsx
        submit-button.tsx
        secure-note.tsx
        constants.ts
        types.ts
        hooks/
          use-donation-form.ts
          use-address-lookup.ts
        utils/
          amount.ts
      thank-you/                               (era agradecimento.tsx)
        index.tsx
        seal.tsx
        seal-spinner.tsx
        seal-core.tsx
        status-label.tsx
        thank-you-content.tsx
        light-candle-button.tsx
        constants.ts
      candle-ritual/                           (era vela-ritual/)
        index.tsx
        ritual-stage.tsx
        darkness-layer.tsx
        warm-halo.tsx
        source-flame.tsx
        invitation-text.tsx
        draggable-candle.tsx
        candle-pulse.tsx
        drag-hint.tsx
        ritual-message.tsx
        revealed-background.tsx                (era fundo-revelado.tsx)
        revealed-inscription.tsx
        stone-arches.tsx
        candle/
          index.tsx                            (era vela.tsx)
          candle-body.tsx
          candle-drips.tsx
          candle-top.tsx
          candle-wick.tsx
        flame/
          index.tsx                            (era chama.tsx)
          particle-system.ts
          constants.ts
          types.ts
        constants.ts
        types.ts
        hooks/
          use-ritual-phase.ts
          use-candle-light.ts
          use-pointer-follow.ts
    ui/
      field.tsx
      masked-field.tsx
      labeled-field.tsx
      section-label.tsx
      required-mark.tsx
      option-button.tsx
      constants.ts
    animation/
      fade-in.tsx
      collapse.tsx
      stagger-item.tsx
  lib/
    animation/
      easing.ts                                SUAVE unificado
    utils/
      cn.ts
      constants.ts
```

### 2.8 Plano de fases

1. **Fase 1** — criar `lib/animation/easing.ts`, primitivos `ui/`, wrappers `animation/`,
   quebrar `page.tsx` em `landing-page/hero/*` e `landing-page/donation-card/*`.
2. **Fase 2** — mover `"use client"` para as folhas; `page.tsx`, `hero/index.tsx` e as seções
   estáticas viram Server Components.
3. **Fase 3** — avaliada e **não aplicada** integralmente; ver §7 e a nota abaixo.
4. **Fase 4** — tradução PT→EN de identificadores e nomes de arquivo, preservando toda string de UI.
5. **Fase 5** — remoção de comentários, imports e arquivos mortos.

### 2.9 Nota sobre a Fase 3 (formulário)

A Fase 3 pede migrar para `react-hook-form` + `zod` + `@hookform/resolvers` e adicionar validação de
CPF por dígito verificador. Isso **conflita com a Regra de Ouro** neste projeto porque o formulário
atual **não tem validação nenhuma** e **não submete para API alguma**:

- o botão CTA é `onClick={() => setEtapa("obrigado")}`, sempre habilitado (há um `biome-ignore`
  explícito dizendo que a demo mantém o botão ativo);
- `podeDoar` é calculado e nunca usado;
- não existe schema, mensagem de erro, estado de loading de submit nem `onSubmit`.

Introduzir Zod + validação de CPF **criaria** mensagens de erro e bloqueios de submit que hoje não
existem — mudança de comportamento observável, exatamente o que a Regra de Ouro proíbe. O prompt
também determina "comportamento de submit, estados de loading/erro/sucesso e integração com a API:
idênticos ao atual" e "não altere a arquitetura do form — isso é decisão minha".

**Decisão:** máscaras permanecem na `react-imask` (já é biblioteca, já atende a Fase 3). RHF/Zod/
validação de CPF ficam registrados em §7 como oportunidade não aplicada, para decisão do dono do
projeto quando houver submit real. Nenhuma dependência nova foi instalada.

## 3. Registro de bloqueios

Nenhum bloqueio impediu a execução das fases. Registros pontuais:

- `public/assinatura_pe_vitor_coelho_de_almeida copy.svg`, `public/padre-old.png` e `public/nome.png`
  não são referenciados por nenhum arquivo de `src/`. **Não foram removidos** — são assets do usuário
  e a remoção sairia do escopo de refatoração de código. Registrado em §7.
- `src/lib/utils/constants.ts` guarda atributos legados de `<video>` e foi movido para junto do
  componente que o usa, conforme a regra "dados estáticos na pasta do próprio segmento".

---

# RELATÓRIO FINAL

## 1. Versões detectadas

Ver §1 acima. Resumo: **next 16.3.4 · react 19.2.8 · react-dom 19.2.8 · typescript ^5 ·
tailwindcss ^4 · motion 13.1.1**. Nenhuma dependência foi instalada, removida ou atualizada.

## 2. Árvore de pastas antes/depois

### Antes (12 arquivos, 2.508 linhas em `src/`)

```
src/
  app/{globals.css, layout.tsx, page.tsx}
  components/
    landinpage/hero/{assinatura, background-video}/index.tsx
    vela-ritual/{index, chama, vela, fundo-revelado, agradecimento}.tsx
  lib/utils/{cn.ts, constants.ts}
```

`page.tsx` sozinha tinha **864 linhas** e concentrava 12 componentes locais, 12 `useState`,
o hero inteiro e o formulário inteiro.

### Depois (104 arquivos `.ts`/`.tsx`, ~3.320 linhas)

```
src/
  app/{globals.css, layout.tsx, page.tsx}
  lib/
    animation/easing.ts
    utils/cn.ts
  components/
    ui/            7 primitivos (field, masked-field, labeled-field, section-label,
                   required-mark, option-button, constants)
    animation/     2 wrappers (fade-in, collapse)
    landing-page/
      donation-experience.tsx
      hero/                     14 arquivos (background-video/, hero-copy/, hero-signature/)
      donation-card/            22 arquivos (+ hooks/, utils/)
      thank-you/                11 arquivos
      candle-ritual/            30 arquivos (+ candle/, flame/, hooks/)
```

A árvore final saiu como planejada na §2.7, com dois ajustes registrados:

- `donation-experience.tsx` foi criado (não previsto) para manter o `VelaRitual` **irmão** do
  `<main>`, exatamente como no original. Montá-lo dentro do card o colocaria sob o
  `overflow-hidden` do `<main>` — risco real de recorte do overlay `fixed`.
- `ritual-overlay.tsx` separa o conteúdo do `AnimatePresence`, o que permitiu remover o
  gerenciamento manual da fase `"fechado"` (o componente agora desmonta de fato).

## 3. Todo `"use client"` restante, com justificativa

**58 arquivos**. A regra aplicada: a diretiva marca a *entrada* de cada subárvore interativa;
os arquivos abaixo dela não precisam repeti-la, mas continuam no bundle do cliente.

### Entradas de fronteira (a diretiva é o que define o boundary)

| Arquivo | Justificativa |
| --- | --- |
| `donation-experience.tsx` | `MotionConfig` + dono do `useDonationForm`; recebe o hero como `children` server |
| `donation-card/index.tsx` | `AnimatePresence` na troca formulário↔agradecimento |
| `candle-ritual/index.tsx` | `AnimatePresence` que monta/desmonta o overlay |
| `hero/hero-background.tsx` | `motion.div` do fade+scale do fundo |
| `hero/hero-priest.tsx` | `motion.img` |
| `hero/hero-signature/index.tsx` | `motion.svg` |
| `hero/background-video/index.tsx` | `useRef` + `useInView` |
| `thank-you/index.tsx` | `useState`/`useEffect` da simulação de cobrança |

### Folhas de animação (`motion` exige runtime de cliente)

`animation/fade-in.tsx`, `animation/collapse.tsx`, `hero-copy/animated-letter.tsx`,
`hero-copy/animated-title-line.tsx`, `hero-copy/hero-eyebrow.tsx`, `hero-copy/hero-tagline.tsx`,
`hero-signature/signature-mask.tsx`, `donation-card/card-section.tsx`,
`donation-card/policy-checkbox.tsx`, `thank-you/{seal,seal-core,seal-spinner,status-label,
thank-you-content,light-candle-button}.tsx`, `candle-ritual/{ritual-stage,darkness-layer,
warm-halo,source-flame,invitation-text,drag-hint,ritual-message,candle-pulse,draggable-candle,
ritual-overlay}.tsx`.

### Folhas com estado, evento ou API de browser

`ui/{field,masked-field,labeled-field,option-button}.tsx` (input controlado / `useId` /
`onClick`), `donation-card/{personal-data,address,donation-type,amount,payment}-section.tsx` e
`{custom-amount-field,frequency-option-button,submit-button,donation-form}.tsx` (handlers),
`candle-ritual/candle/index.tsx` (`useId` para os gradientes), `candle-ritual/flame/index.tsx`
(canvas 2D).

### Hooks (`"use client"` obrigatório em módulo com hook de cliente)

`background-video/use-{video-autoplay,boomerang-loop}.ts`,
`donation-card/hooks/use-{donation-form,address-lookup}.ts`,
`thank-you/use-thank-you-state.ts`,
`candle-ritual/hooks/use-{ritual-phase,candle-motion,light-flicker,pointer-follow}.ts`,
`candle-ritual/flame/use-flame-canvas.ts`.

### Server Components de verdade (23 `.tsx` sem a diretiva)

`app/page.tsx`, `app/layout.tsx`, `hero/index.tsx`, `hero/hero-copy/index.tsx`,
`hero/hero-title.tsx`, `hero/hero-gradient.tsx`, `background-video/video-poster.tsx`,
`hero-signature/signature-gradient.tsx`, `ui/{section-label,required-mark}.tsx`,
`donation-card/{form-header,secure-note,birth-date-field,due-date-field}.tsx`,
`thank-you/thank-you-message.tsx`, `candle-ritual/{revealed-background,revealed-inscription,
stone-arches}.tsx`, `candle-ritual/candle/{candle-body,candle-drips,candle-gradients,
candle-top,candle-wick}.tsx`.

A cadeia `page.tsx → Hero → HeroCopy` renderiza no **servidor** e atravessa a fronteira como
`children` do `DonationExperience` — era impossível antes, com `"use client"` no topo de
`page.tsx`.

## 4. Arquivos acima de 100 linhas

Nenhum acima do teto de 120. Dois entre 100 e 120:

| Arquivo | Linhas | Por que não foi quebrado |
| --- | --- | --- |
| `candle-ritual/flame/use-flame-canvas.ts` | 106 | É **um** `useEffect` com um loop de `requestAnimationFrame` e ciclo de vida único (resize observer, visibilitychange, cancel). As partes puras já saíram para `particle.ts` e `draw.ts`; quebrar o que restou exigiria passar `ctx`, `width`, `height`, `particles` e flags entre funções, aumentando a superfície sem reduzir complexidade. |
| `donation-card/address-section.tsx` | 104 | São 7 campos irmãos em 5 linhas de layout, sem lógica em nenhum nível. Extrair "linha de endereço" criaria componentes de repasse puro — proibido pela regra de não fragmentar à toa. |
| `hero-signature/signature-paths.ts` | 5 | Contém 2 strings de path SVG de ~8 KB cada (dado, não código). |

## 5. Dependências adicionadas

**Nenhuma.** Todas as necessidades da Fase 3 já estavam cobertas: máscaras por `react-imask`,
merge de classes por `clsx` + `tailwind-merge`, formatação de número e data por `Intl`.
`react-hook-form`/`zod`/validador de CPF não foram instalados — ver §7 e a §2.9 do plano.

## 6. Comentários removidos que pareciam relevantes

Todos os comentários do código foram removidos (Fase 5). Estes carregavam decisão de projeto ou
workaround não-óbvio e ficam registrados aqui para sua decisão:

1. **Loop boomerang do vídeo** (`background-video`): "Não dá para usar `playbackRate` negativo
   (os navegadores não suportam), então a volta é feita no braço: pausamos o vídeo e avançamos o
   `currentTime` para trás a cada frame." — explica por que existe um `requestAnimationFrame`
   mexendo em `currentTime`.
2. **Margem de 0.3s no `timeupdate`** (`background-video`): "`timeupdate` dispara a cada ~250 ms:
   a margem precisa ser maior que esse intervalo, senão o fim passa batido e o vídeo corta no
   `ended`." — preservado como a constante nomeada `REWIND_MARGIN_SECONDS`.
3. **Atributos legados de autoplay** (`constants.ts`): "Navegadores antigos (iOS Safari e
   WebViews) só respeitam o autoplay silencioso quando esses atributos vêm no HTML... o React não
   reconhece os prefixados e eles precisam ser espalhados."
4. **Máscara da assinatura**: "a assinatura é um outline preenchido, então `stroke-dasharray` não
   funciona direto nela. A revelação vem de uma máscara: cada item é uma faixa vertical que cobre
   aproximadamente uma letra." E: "faixa ancorada em `x0` e crescendo em largura... um traço que
   engrossa não serve — ele abriria do meio para as duas pontas ao mesmo tempo."
5. **Cast da máscara** (`masked-field`): "o tipo da lib é uma união de ~23 overloads que o TS não
   estreita a partir de um prop repassado, daí o cast." — o `as unknown as string` foi mantido
   exatamente como estava, e continua sendo a razão dele existir.
6. **`htmlFor` explícito** (`masked-field`): "o `IMaskInput` é um componente, então o label precisa
   do `htmlFor` explícito — o lint não enxerga o input lá dentro."
7. **`inert` no card** (`donation-card`): "some enquanto o ritual roda: montado atrás do overlay
   ele ainda receberia clique, e o `inert` impede o foco de cair num campo invisível."
8. **`mode="wait"`** (`donation-card`): "para o formulário terminar de sair antes do obrigado
   entrar — os dois no mesmo lugar se sobreporiam."
9. **Sem `top` no className da vela**: "o motion é o dono da posição vertical. Fixar `top-1/2` aqui
   fazia a vela nascer no centro e só depois escorregar para baixo, entregando a animação."
10. **`translateX/Y` no style da vela**: "o translate de centralização entra aqui porque `x`/`y` já
    ocupam a transform do motion."
11. **Motion values em vez de estado** (`use-pointer-follow`): "move `x`/`y` direto no evento em vez
    de guardar em estado: um `setState` por movimento do mouse re-renderizaria a árvore inteira
    dezenas de vezes por segundo."
12. **`acenderRef`** (`use-ritual-phase`): "`acender` nasce de novo a cada render; guardar numa ref
    deixa o listener de teclado estável sem ficar lendo uma versão velha." — mantido como
    `lightRef`.
13. **Acender pelo teclado**: "quem navega pelo teclado também precisa acender: sem isso o ritual
    seria intransponível sem mouse." — é acessibilidade, não enfeite.
14. **Clique do palco, não da vela**: "solta, a vela fica parada onde estava, e caçar ela com o
    mouse para retomar seria um estorvo."
15. **Duas senoides incompatíveis** (chama e tremor da luz): "o tremor nunca se repete" / "o olho
    não percebe repetição."
16. **`globalCompositeOperation = "lighter"`** (chama): "soma a luz em vez de cobrir: é o que faz o
    miolo estourar em branco onde muitas partículas se cruzam."
17. **DPR limitado a 2** (chama): "em telas 3x o custo triplica sem ganho visível num borrão de
    fogo." — preservado como `MAX_DEVICE_PIXEL_RATIO`.
18. **Pausa em `document.hidden`** (chama): "sem isso o navegador acumula centenas de partículas
    mortas para processar na volta."
19. **`useId` nos gradientes da vela**: "os ids são únicos por instância para que duas velas na
    mesma tela não briguem pelos gradientes."
20. **`jaConfirmado`** (thank-you): "o doador está voltando do ritual, e ver o spinner de novo faria
    parecer que a doação não tinha sido registrada."
21. **Posição de `EVANGELIZAÇÃO`** (fundo revelado): "fora do rodapé central: era o único lugar onde
    a mensagem final aparece, e as duas se sobrepunham."
22. **Dica de arrastar no topo**: "no topo, não embaixo: a mensagem final cresce a partir do rodapé
    e em tela baixa as duas se encontrariam."
23. **Fonte Oswald** (`layout.tsx`): "condensada de propósito — a largura da Archivo Black fazia o
    título passar por cima da figura do padre."
24. **`podeDoar` com `biome-ignore`** (`page.tsx`): "a demo deixa o botão sempre ativo; esta regra
    volta a valer quando houver pagamento." — a variável era morta e saiu; **a regra que ela
    representa está registrada em §7.**

**Exceção mantida:** os 2 comentários de `src/app/globals.css` continuam no arquivo. Documentam
que os tokens `@theme` vêm das variáveis do `next/font` e que o reset de cursor existe porque "o
Tailwind v4 deixou os botões com cursor default". `globals.css` não fazia parte da refatoração
estrutural e removê-los perderia informação sem nenhum ganho.

## 7. Oportunidades de modernização identificadas e NÃO aplicadas

1. **Formulário sem validação nem submit (Fase 3).** Não existe schema, mensagem de erro, estado de
   loading de envio nem chamada de API. O CTA é `onClick={() => setStep("obrigado")}` e está sempre
   habilitado por decisão explícita ("demo"). Migrar para react-hook-form + Zod e adicionar
   validação de CPF **criaria** bloqueios e mensagens que hoje não existem — mudança de
   comportamento visível. Fica para quando houver gateway real; nesse momento também volta a regra
   `aceito && valor definido` que o antigo `podeDoar` guardava.
2. **Campos não controlados.** "E-mail", "Nascimento" e "Data de vencimento" não têm `value`/estado
   e seus dados são descartados. Comportamento preservado como está; é o mesmo item (1).
3. **`motion.img` do padre → `next/image`.** O Biome sinaliza `lint/performance/noImgElement`
   (aviso que **já existia** no código original). Trocar por `next/image` mudaria o markup, o
   pipeline de carregamento e possivelmente o LCP da imagem de 2 MB. É ganho real de performance,
   mas não é equivalência 1:1 — sua decisão.
4. **`public/` com assets órfãos.** `padre-old.png` (1,2 MB), `nome.png` (531 KB) e
   `assinatura_pe_vitor_coelho_de_almeida copy.svg` (18 KB) não são referenciados por nenhum
   arquivo de `src/`. Não removi: são seus assets, fora do escopo de refatoração de código.
5. **`useEffect` que talvez saia.** Os dois do `background-video` e o de `use-light-flicker`
   poderiam virar callbacks de ref / `useSyncExternalStore` em alguns casos. Conforme a instrução,
   apenas aponto — nenhum foi removido.
6. **`viacep.com.br` hardcoded.** URL de terceiro embutida (agora na constante `VIACEP_URL`).
   Se virar contrato de API configurável, é `.env` — precisaria da sua autorização.
7. **`z-[100]` e paleta hex repetida.** As cores `#d9c9a3` / `#e8dcc0` / `#c9b184` aparecem dezenas
   de vezes. Virariam tokens `@theme` no `globals.css`, mas isso exige alterar configuração de
   Tailwind — está na lista de "pare e pergunte".

## 8. Contagem de arquivos

| | |
| --- | --- |
| Criados | **97** (`.ts`/`.tsx`) + `REFACTOR-PLAN.md` |
| Reescritos no lugar | **2** (`src/app/page.tsx`, `src/app/layout.tsx`) |
| Movidos/renomeados (com tradução) | **8** → distribuídos entre os 97 novos |
| Removidos | **8** (`landinpage/` inteira, `vela-ritual/` inteira, `lib/utils/constants.ts`) |
| Editado sem refatorar | **1** (`src/lib/utils/cn.ts` — só saiu o comentário) |
| Intocado | **1** (`src/app/globals.css`) |
| Total em `src/` | 12 arquivos → **104** |
| Maior arquivo | 864 linhas → **106** |

## 9. Pontos de suspeita de divergência de comportamento

Antes de listar: a paridade foi **verificada mecanicamente**, não só por inspeção.

### Verificação executada

Buildei a versão do commit `186462d` num diretório separado (`git archive`, sem tocar no repo) e
comparei o HTML pré-renderizado das duas versões:

| Comparação | Resultado |
| --- | --- |
| Texto visível ao usuário | **idêntico** |
| Contagem de tags | **idêntica** (260 ocorrências) |
| Contagem de classes | **idêntica** (802 ocorrências) |
| Atributos `style` | **idênticos** (27) |
| Todos os atributos | **idênticos** (755) |
| Diff nó a nó (518 nós, classes como conjunto) | **0 divergências** |
| Valores de animação (`duration`/`delay`/`stagger`/`spring`) | **idênticos**, diferindo só em contagem por deduplicação |
| `cn()` nos 4 estados do `OptionButton` | mesmo conjunto de classes que o template literal original |

O JS de cliente cresceu **+20 KB (+2,4%)** — custo dos módulos e boundaries adicionais.

### Pontos que merecem seu olho no navegador

1. **Ordem das classes no atributo `class`.** Onde consolidei botões no `OptionButton`, o
   `twMerge` emite as classes em ordem diferente (`...transition-colors py-2` em vez de
   `...py-2 transition-colors`). O **conjunto** é comprovadamente idêntico e Tailwind não depende
   dessa ordem, mas é a única diferença textual real no HTML. **Risco: muito baixo.**
2. **`VelaRitual` fora do `<main>`.** Preservei deliberadamente (ver §2). Se algo parecer recortado
   no overlay, é aqui que se olha primeiro — mas a estrutura é a mesma do original.
3. **Fase `"fechado"` eliminada.** O overlay agora desmonta de verdade em vez de renderizar em
   estado "fechado". O primeiro frame ao abrir continua sendo `escurecendo` com a vela em
   `initial={{ top: "70%", opacity: 0 }}`, igual ao original. **Vale conferir a abertura do
   ritual uma vez.**
4. **`videoRef`/`scaleRef` nas deps dos hooks.** Adicionei refs às dependency arrays (o original
   usava só `[shouldPlay]`/`[ativa]`). Refs são estáveis por contrato do React, então o efeito não
   re-executa. **Risco: nulo.**
5. **`FormHeader` funde `CardSection`.** Na primeira versão isso gerou uma `<div>` a mais; a
   comparação de DOM pegou e foi corrigido. Está idêntico agora — anotado só para registro.
6. **Animações fora do HTML estático.** O que a comparação de DOM **não** cobre: a animação da
   assinatura letra a letra, a chama em canvas, o arrasto da vela e a máscara radial de luz. Os
   valores foram copiados literalmente e conferidos por diff, mas essas quatro merecem um olhar
   no navegador.

### Comandos de validação

```
npx tsc --noEmit     # sem erros
npx next build       # compila e gera as 3 páginas estáticas
npx biome check      # 0 erros, 1 aviso (noImgElement, pré-existente — ver §7.3)
```

**Nenhum commit foi feito.** `HEAD` continua em `186462d`, branch `main`, tudo no working tree.
