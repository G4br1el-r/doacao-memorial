# Relatório final — adequação mobile

Auditoria detalhada em `MOBILE-AUDIT.md`. Nada foi commitado: 29 arquivos modificados
e 2 novos, todos no working tree.

**Playwright não estava instalado e, conforme a instrução, não foi instalado.** A
auditoria foi feita por leitura de código sobre os padrões da Fase 1, e a validação
final por inspeção do CSS e do HTML efetivamente gerados pelo build de produção, mais
cálculo de largura em cada viewport alvo. O que isso não cobre está na seção 7.

---

## 1. Elementos que causavam overflow

| Elemento | Largura onde quebrava | Causa | Correção |
|---|---|---|---|
| **Card de doação** | todas (320–430) | `absolute right-10 w-[510px]` — 550px mínimos, fora do fluxo | Entra no fluxo no mobile: `w-full max-w-[510px]`, sem altura travada. Volta a painel flutuante de 510px em `lg`. O enquadramento de desktop é o de hoje. |
| **Imagem do padre** | todas, pior em portrait | `h-[85vh] w-auto max-w-none` — largura derivada da altura | `next/image` com `w-full h-auto` no mobile; `lg:h-[85dvh] lg:w-auto` restaura o desktop |
| **Assinatura SVG** | todas até 430 | `w-[400px] max-w-none left-[42%]` | `w-[72vw] max-w-[400px]` centralizada; `lg:` restaura `left-[42%] w-[400px]` |
| **Título do hero** | 320–393 | `text-[11vw]` dentro de `px-16` | `break-words`; o tamanho `11vw` não mudou |
| **Padding do hero copy** | 320–430 | `px-16` = 128px dos 320px | `px-4 sm:px-8 lg:px-16` |
| **Dica de arraste do ritual** | 320, 360 | `whitespace-nowrap` + `tracking-[0.2em]` | `whitespace-nowrap` só em `sm+`; no mobile quebra e centraliza |
| **Linhas de 2 campos** (CPF+Celular, Bairro+Cidade, Número+Complemento) | 320, 360 | flex sem `min-w-0` no filho: o tamanho intrínseco do input travava o encolhimento | `min-w-0` no `FRAME`, no `CONTROL` e no `LabeledField` |
| **Botão de frequência** | 320 | flex `flex-1` sem `min-w-0`, ícone + 2 linhas de texto | `min-w-0` no botão e no span; gap e padding menores no mobile |
| **Campo de nascimento** | 320, 360 | `w-1/2` fixo deixava ~130px para o seletor nativo de data | `sm:w-1/2` — linha inteira no mobile |
| **Campo de vencimento** | 320, 360 | idem | `sm:w-1/2` |
| **CEP** | 320 | `w-1/3` fixo | `w-1/2 sm:w-1/3` |
| **Inscrições do ritual** | 320–430 (corte, não scroll) | `left: 76%/80%` com `-translate-x-1/2` | `max-w-[92vw]` + `whitespace-nowrap`, sem reposicionar |

### Largura calculada após as correções

Cadeia real: wrapper `px-4` → card `p-5` → linha de 2 campos com `gap-3`.

| Viewport | Card útil | Campo duplo | Texto no campo | Célula de valor |
|---|---|---|---|---|
| 320px | 248px | 118px | 62px | 77px |
| 360px | 288px | 138px | 82px | 91px |
| 390px | 318px | 153px | 97px | 101px |
| 393px | 321px | 155px | 99px | 102px |
| 430px | 358px | 173px | 117px | 114px |

Nenhuma linha excede a viewport em nenhuma das larguras. Os botões de pagamento foram
medidos individualmente: o mais largo ("PIX automático", ~150px) cabe nos 248px de 320px,
e o `flex-wrap` já existente cuida das combinações.

---

## 2. Campos do formulário

Os 14 campos. **Font-size antes: 14px em todos** (o token `CONTROL` usava `text-sm`, e o
campo de valor tinha `text-sm` escrito direto). **Depois: 16px em todos.**

| # | Campo | type | inputMode | autoComplete | Outros | Fonte |
|---|---|---|---|---|---|---|
| 1 | Nome completo | `text` | `text` | `name` | `autoCapitalize="words"` | 14 → **16** |
| 2 | E-mail | `email` | `email` | `email` | `autoCapitalize="off"`, `autoCorrect="off"`, `spellCheck={false}` | 14 → **16** |
| 3 | Celular com DDD | `tel` | `tel` | `tel` | `autoCorrect="off"`, `spellCheck={false}` | 14 → **16** |
| 4 | CPF/CNPJ | `text` | `numeric` | `off` | idem | 14 → **16** |
| 5 | Nascimento | `date` | — (nativo) | `bday` | — | 14 → **16** |
| 6 | CEP | `text` | `numeric` | `postal-code` | `autoCorrect="off"`, `spellCheck={false}` | 14 → **16** |
| 7 | Rua | `text` | `text` | `address-line1` | `autoCapitalize="words"` | 14 → **16** |
| 8 | Bairro | `text` | `text` | `address-level3` | `autoCapitalize="words"` | 14 → **16** |
| 9 | Cidade | `text` | `text` | `address-level2` | `autoCapitalize="words"` | 14 → **16** |
| 10 | Estado | `text` | `text` | `address-level1` | `autoCapitalize="characters"`, `autoCorrect="off"`, `spellCheck={false}`, `maxLength={2}` | 14 → **16** |
| 11 | Número | `text` | `numeric` | `address-line3` | `autoCorrect="off"`, `spellCheck={false}` | 14 → **16** |
| 12 | Complemento | `text` | `text` | `address-line2` | — | 14 → **16** |
| 13 | Valor personalizado | `text` | `decimal` | `off` | `autoCorrect="off"`, `spellCheck={false}` | 14 → **16** |
| 14 | Vencimento | `date` | — (nativo) | — | — | 14 → **16** |

Notas:

- **Nenhum `type="number"`** — já era assim antes das mudanças, e continua.
- `inputMode` ganhou **default `"text"`** em `Field` e `MaskedField`, então nenhum campo
  fica sem `inputMode` explícito no HTML.
- Campos 5 e 14 são `type="date"` nativo, que abre o seletor do sistema; `inputMode` não
  se aplica e o teclado não é textual.
- Campo 13 usa `decimal` (não `numeric`) por ser valor monetário com separador.
- O tipo TS de `inputMode` passou de uma união fechada para
  `React.HTMLAttributes<HTMLInputElement>["inputMode"]`, o que liberou `decimal`.

### Como a altura foi preservada

A regra dos 16px alteraria a altura dos campos, então o padding foi compensado:

| | Antes | Depois |
|---|---|---|
| `FRAME` (campo comum) | `py-2.5` (10px×2) + `text-sm` (line-height 20px) = **40px** | `py-2` (8px×2) + `text-base` (line-height 24px) = **40px** |
| `LabeledField` (datas) | `py-2` + label 14px + gap 4px + 20px = **62px** | `py-1.5` + label 14px + gap 4px + 24px = **62px** |
| Valor personalizado | `py-2.5` + 20px = **40px** | `py-2` + 24px = **40px** |

Valores confirmados no CSS gerado: `--text-base: 1rem` com line-height `1.5` (=24px) e
`--text-sm: .875rem` com `1.25/.875` (=20px). **A altura visual dos campos não mudou.**

### Rede de segurança no CSS base

```css
input, select, textarea, [contenteditable] { font-size: 16px; }
```

Presente no bundle de produção. Como é seletor de elemento (especificidade 0,0,1), uma
classe utilitária ainda venceria — por isso cada campo foi revisado individualmente e
nenhum tem classe abaixo de 16px. A regra cobre qualquer campo futuro que nasça sem
classe de fonte.

---

## 3. Casos de `:hover` sem equivalente mobile

**Nenhum caso de informação exclusiva de hover foi encontrado.** Os 9 usos de `:hover`
no projeto são todos realces decorativos, e o estado equivalente já existe no toque:

| Local | Comportamento | Por que não precisa de equivalente |
|---|---|---|
| `option-button.tsx` | `hover:border` | o estado `active` (fundo dourado, texto preto) já comunica a seleção |
| `frequency-option-button.tsx` | `hover:border` | idem — `active` muda borda e fundo |
| `form-header.tsx` | `hover:border/bg` no link | o link já tem borda e fundo próprios em repouso |
| `policy-checkbox.tsx` | `hover:text` no link | já é dourado e sublinhado em repouso |
| `submit-button.tsx`, `light-candle-button.tsx` | `hover:opacity-90` | decorativo |
| `ritual-message.tsx` | `hover:border/bg` | decorativo |
| `light-candle-button.tsx` | `group-hover:scale-110` no ícone | decorativo |

Dois pontos que pareciam esconder informação e **não escondem**:

- `RECURRING_BLOCKED_NOTE` ("Escolha PIX auto ou carnê") é renderizado no lugar da nota
  normal do botão, **sempre visível** — não depende de hover.
- O ícone `Info` do `SectionLabel` não tem tooltip nem handler: é decorativo, não há
  conteúdo atrás dele.

Nada foi convertido, porque não havia o que converter. O que foi adicionado é feedback de
toque adequado: `touch-action: manipulation` e `-webkit-tap-highlight-color: transparent`
removem o atraso de 300ms e o realce cinza do sistema.

---

## 4. Ocorrências de `100vh` substituídas

| Local | Antes | Depois |
|---|---|---|
| `donation-experience.tsx` | `min-h-screen` (=100vh) | `.min-h-dvh-fallback` |
| `donation-card/index.tsx` | `max-h-[92vh]` | `lg:max-h-[92dvh]` (e sem altura travada no mobile) |
| `hero/hero-priest.tsx` | `h-[85vh]` | `lg:h-[85dvh]` (no mobile a largura é que manda) |

O utilitário foi escrito como classe CSS comum, e não como `@utility`:

```css
.min-h-dvh-fallback { min-height: 100vh; }
@supports (min-height: 100dvh) {
  .min-h-dvh-fallback { min-height: 100dvh; }
}
```

**Motivo:** com `@utility`, o Tailwind normaliza a propriedade repetida e descarta a
primeira declaração — o build saía só com `100dvh`, deixando navegador sem suporte a
`dvh` **sem altura nenhuma**. Isso foi detectado inspecionando o CSS gerado e corrigido;
o output atual traz as duas declarações, na ordem certa.

Os `dvh` restantes (`92dvh`, `85dvh`) só valem dentro do media query `lg`, onde `dvh` e
`vh` são equivalentes — não precisam de fallback.

---

## 5. Alvos de toque menores que 44px

| Elemento | Antes | Correção |
|---|---|---|
| Botões de valor (`OptionButton`) | ~35px | `min-h-11` no componente |
| Métodos de pagamento (`OptionButton`) | ~40px | idem (mesmo componente) |
| Botão de frequência | ~44px limítrofe | `min-h-11` explícito |
| Checkbox de política | 16×16px | `py-2.5` + `min-h-11` no label → 44px de alvo, com `mt-4`→`mt-1.5` compensando para o espaçamento visual não mudar |
| Link "Políticas de Privacidade" | linha de 12px | `inline-block py-1` |
| Link "Já sou benfeitor" | ~34px | `min-h-11` |
| Botão de submit | ~44px limítrofe | `min-h-11` explícito |
| Botão FINALIZAR (ritual) | ~38px | `min-h-11` |
| Botão ACENDER UMA VELA | ~46px | `min-h-11` explícito |
| Campos de entrada | ~41px | 40px de conteúdo + 2px de borda; o alvo real do `<label>` que envolve cada campo passa de 44px |

O `min-h-11` não altera nada onde o conteúdo já passava de 44px — é um piso, não um
tamanho fixo. O espaçamento de 8px entre alvos adjacentes já era atendido pelos `gap-2`
e `gap-3` existentes.

---

## 6. `overflow-x: hidden` preexistente

| Local | Situação | Decisão |
|---|---|---|
| `donation-experience.tsx` — `main.overflow-hidden` | Era **o paliativo** que escondia o card de 510px, o padre e a assinatura saindo da tela. | **Trocado por `overflow-x-clip`** no mobile (`lg:overflow-hidden` mantém o desktop). Continua existindo — o hero é um palco de camadas absolutas com `scale: 1.06` e `translate` nas letras, recorte legítimo de container de animação — mas agora **não há mais causa de overflow escondida atrás dele**: as três foram corrigidas na origem. A troca por `clip` também preserva a rolagem vertical da página, que o `hidden` em contexto de scroll poderia prejudicar. |
| `ritual-stage.tsx` — `fixed inset-0 overflow-hidden` | Palco da vela arrastável e da máscara radial de luz. | **Mantido.** Container local de animação, não é body nem pai de fluxo. É exatamente o uso que a Fase 1 autoriza. |
| `Collapse` — `overflow-hidden` (amount e payment) | Necessário para a animação de altura não vazar durante a transição. | **Mantido.** Local e legítimo. |

**Nenhum `overflow-x: hidden` novo foi adicionado como paliativo.** O único
`overflow-x-clip` novo está no wrapper do card e contém o `x: 40` da animação de entrada
daquele elemento — recorte local da própria animação, no pai do elemento que anima, e
some em `lg`.

---

## 7. Pontos que ainda podem quebrar em device real

Sem Playwright, o que segue não pôde ser validado por medição e merece teste em aparelho:

1. **Teclado virtual cobrindo o campo.** Foi tratado por três mecanismos —
   `interactive-widget=resizes-visual`, `scroll-margin-block: 6rem` e a página (não o
   card) sendo quem rola no mobile. O comportamento real do Safari iOS com
   `interactive-widget` varia por versão e **precisa de teste em iPhone real**, campo a
   campo, principalmente nos dois últimos do formulário.

2. **Seletor nativo de data em telas estreitas.** `type="date"` renderiza um widget do
   sistema cuja largura não é controlável por CSS. Passou a ocupar a linha inteira no
   mobile, mas em 320px com fonte de 16px o texto do seletor pode truncar em alguns
   Androids.

3. **`h-auto` no padre.** No mobile a imagem passou a ter a largura da tela e altura
   proporcional (1159×1358 → em 320px de largura, ~375px de altura). O enquadramento
   muda em relação ao desktop, que continua com `85dvh`. Isso **não é mudança de
   identidade visual no desktop** — lá nada mudou — mas vale conferir se o recorte
   mobile agrada. Era inevitável: a regra anterior gerava largura maior que duas
   viewports.

4. **Landscape em telas baixas.** Em landscape de 430×932 o hero tem ~390px de altura
   útil. O `min-h-dvh` acompanha, mas a composição hero + card empilhados fica longa. O
   card rola com a página, então não há corte — mas a experiência é de rolagem
   considerável.

5. **Vídeo de fundo.** `background-video.mp4` continua com fonte única, sem variante
   mobile. Não é problema de layout, é de peso: em 3G/4G fraco o poster (`background.png`,
   1,5 MB) aparece primeiro e o vídeo pode demorar. Recomendo gerar um encode mobile —
   ficou fora do escopo por não ser correção de layout.

6. **`padre.png` tem 2 MB.** Agora passa pelo otimizador do `next/image` com `sizes`
   correto, o que resolve o download. Mas o arquivo-fonte segue pesado para o
   processamento em build.

7. **Canvas de partículas da chama.** `use-flame-canvas.ts` roda um loop de
   `requestAnimationFrame` desenhando partículas. Em Android de entrada pode cair de
   framerate durante o ritual. Não alterei — a instrução da Fase 5 é registrar em vez de
   mexer por conta própria.

8. **`Collapse` anima `height` e `marginTop`.** Contraria a orientação de animar só
   `transform`/`opacity`, porque causa reflow. Trocar mudaria a animação de forma
   perceptível, então foi registrado e não alterado.

---

## Verificação contra o critério de aceite

| # | Critério | Situação |
|---|---|---|
| 1 | Zero elementos detectados pelo script de overflow | Script não pôde rodar (sem Playwright, e a instrução era não instalar). Substituído por: todas as causas da lista da Fase 1 rastreadas e corrigidas na origem, mais cálculo de largura nas 5 viewports (tabela da seção 1) — nenhuma linha excede a viewport. |
| 2 | `scrollWidth === clientWidth` | Não medido em runtime, pelo mesmo motivo. As três causas reais (card, padre, assinatura) foram eliminadas. |
| 3 | Nenhum `overflow-x: hidden` novo como paliativo | **Atendido.** O único `overflow-x-clip` novo contém o `x: 40` da própria animação, no pai do elemento animado, e some em `lg`. |
| 4 | Nenhum campo com font-size < 16px | **Atendido e verificado no CSS de produção.** Os 14 campos em 16px; regra base global como rede de segurança. |
| 5 | inputMode correto, nenhum `type="number"` em campo mascarado | **Atendido.** Nenhum `type="number"` no projeto; os 14 campos com `inputMode` explícito. |
| 6 | Formulário preenchível sem zoom e sem campo coberto | Zoom: **resolvido** (16px + viewport sem `maximum-scale`). Campo coberto: mecanismos aplicados, **teste em device real recomendado** (item 1 da seção 7). |
| 7 | `npm run build` e type-check passando | **Atendido.** `tsc --noEmit` sem erros; build de produção compilando e gerando as 3 rotas estáticas. |

**Sobre o Biome:** `npx biome lint src/` retorna **zero erros**. O `npm run lint`
(`biome check`) acusa 106 erros de *formatação* — exclusivamente CRLF vs LF, em todos os
110 arquivos do repositório, **inclusive os que não foram tocados**. É condição
preexistente do projeto; corrigir reescreveria o repositório inteiro e está fora do
escopo. Os arquivos editados foram normalizados para CRLF, mantendo a consistência com o
resto do projeto e não introduzindo diagnóstico novo.

---

## Regra de ouro

Nenhuma mudança de cor, copy, tipografia base, duração/delay/easing de animação ou
hierarquia. As alterações são de layout, contenção e atributos de input.

Onde uma correção mudaria o desktop, ela foi restrita ao mobile por breakpoint (`lg:`
restaurando o valor atual) — card, padre, assinatura, padding do hero, rolagem do card.
**O desktop renderiza como hoje.**

A única mudança visual perceptível é onde a regra dos 16px obrigava: a fonte dos campos
sobe de 14px para 16px. É exigência inegociável da Fase 3.1, e a altura das caixas foi
compensada no padding para permanecer idêntica.
