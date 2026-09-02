# Auditoria mobile — doacao-memorial

Playwright não está instalado no projeto (`package.json` não traz `@playwright/test`
nem `playwright`). Conforme a instrução da Fase 0, **não foi instalado**: a auditoria
abaixo foi feita por leitura de código, rastreando os padrões da lista da Fase 1 em
todos os arquivos de `src/`.

Larguras de referência: **320** (iPhone SE), **360** (Android base), **390**
(iPhone 13/14), **393** (Pixel), **430** (iPhone Pro Max), portrait e landscape.

---

## A. Scroll horizontal / overflow

| # | Elemento | Arquivo | Causa | Quebra a partir de |
|---|---|---|---|---|
| A1 | Card de doação | `donation-card/index.tsx:16` | `absolute right-10 top-1/2 w-[510px] -translate-y-1/2` — largura fixa de 510px + 40px de offset direito = 550px mínimos. Também tira o card do fluxo, então ele nunca soma altura à página. | **todas** (320→430) |
| A2 | Imagem do padre | `hero/hero-priest.tsx:11` | `h-[85vh] w-auto max-w-none` — a largura vem da proporção da imagem. Com `max-w-none` explícito, nada a contém; em portrait mobile 85vh gera largura muito maior que a viewport. | **todas**, agravado em portrait |
| A3 | Assinatura SVG | `hero/index.tsx:13` | `w-[400px] max-w-none left-[42%] -translate-x-1/2` — 400px fixos, centro em 42% da viewport. Em 320px o SVG vai de −65px a +335px. | **todas até 430** |
| A4 | Título do hero | `hero/hero-copy/hero-title.tsx:8` | `text-[11vw]` dentro de container com `px-16` (128px de padding lateral somado). Em 320px sobram 192px de área útil. | 320, 360, 390, 393 |
| A5 | Padding do hero copy | `hero/hero-copy/index.tsx:7` | `px-16` = 64px de cada lado. Consome 40% da tela em 320px. | 320–430 |
| A6 | Dica de arraste do ritual | `candle-ritual/drag-hint.tsx:15` | `whitespace-nowrap` + `left-1/2 -translate-x-1/2` — "MOVA O MOUSE PARA ILUMINAR" com `tracking-[0.2em]` não cabe em 320px e não pode quebrar. | 320, 360 |
| A7 | Botões de valor | `donation-card/amount-section.tsx:26` | `grid-cols-3` com "R$ 200,00" por célula. Dentro do card em 320px cada célula fica com ~86px úteis; com a fonte subindo para 16px (Fase 3) estoura. | 320 |
| A8 | Linha CPF/CNPJ + Celular | `donation-card/personal-data-section.tsx:51-72` | `flex gap-3` com dois `MaskedField` `flex-1`. O `input` interno não tem `min-w-0`, então o tamanho intrínseco do input (~20ch) impede o encolhimento do flex item. | 320, 360 |
| A9 | Linha Bairro + Cidade | `donation-card/address-section.tsx:56-70` | Mesmo padrão de A8: dois `Field` `flex-1` sem `min-w-0` no input. | 320, 360 |
| A10 | Linha Número + Complemento | `donation-card/address-section.tsx:85-101` | Idem A8. | 320, 360 |
| A11 | Métodos de pagamento | `donation-card/payment-section.tsx:24` | `flex-wrap` presente, mas "PIX automático" + ícone + `px-3` passa de 160px por botão; aperta em 320px. | 320 (limítrofe) |
| A12 | Tipo de doação | `donation-card/donation-type-section.tsx:22` | `flex gap-3` com dois botões `flex-1` contendo ícone `h-5 w-5` + texto, sem `min-w-0` no `<span>` de texto. | 320 |
| A13 | Campos com placeholder longo | `ui/field.tsx:31`, `ui/masked-field.tsx:34` | Nenhum campo tem `min-w-0`; placeholders longos ("Celular com DDD", "Digite outro valor") definem a largura mínima do input. | 320, 360 |
| A14 | Inscrições do ritual | `candle-ritual/constants.ts:17-42` + `revealed-inscription.tsx:10` | `position:absolute` com `left: 76%/80%` e `-translate-x-1/2`. Está sob `pointer-events-none` dentro de stage com `overflow-hidden` **próprio** (legítimo, é palco de animação), então não gera scroll — mas **corta o texto** na borda. | 320–430 (corte, não scroll) |

### Overflow-x: hidden preexistente

| Local | Veredito |
|---|---|
| `donation-experience.tsx:17` — `main.overflow-hidden` | **Paliativo que hoje mascara A1–A3.** É o único motivo de a página não rolar horizontalmente. Precisa ser mantido (o hero é um palco de camadas absolutas com recorte legítimo de `scale`/`translate`), mas A1–A3 têm de ser corrigidos na origem para que ele deixe de esconder bug. |
| `candle-ritual/ritual-stage.tsx:21` — `fixed inset-0 overflow-hidden` | **Legítimo.** Contêiner local de animação (vela arrastável + máscara radial), não é body nem pai de fluxo. Mantido. |
| `amount-section.tsx:48` / `payment-section.tsx:41` — `Collapse` com `overflow-hidden` | **Legítimo.** Necessário para a animação de altura. Mantido. |

---

## B. Viewport e altura (Fase 2)

| # | Item | Arquivo | Situação |
|---|---|---|---|
| B1 | `export const viewport` | `app/layout.tsx` | **Ausente.** Sem `width=device-width` o iOS renderiza em viewport virtual de 980px e reduz tudo. Causa raiz que amplifica A1–A5. |
| B2 | `min-h-screen` (=`100vh`) | `donation-experience.tsx:17` | `100vh` no iOS inclui a barra de endereço → conteúdo do hero cortado por baixo. |
| B3 | `max-h-[92vh]` | `donation-card/index.tsx:16` | Mesmo problema: em Safari iOS 92vh excede a área visível real. |
| B4 | `h-[85vh]` (padre) | `hero/hero-priest.tsx:11` | Idem B2. |
| B5 | safe-area | — | Nenhum `env(safe-area-inset-*)` no projeto. O botão FINALIZAR do ritual (`bottom-8`) e o rodapé do card ficam sob a barra gestual do iPhone. |

---

## C. Formulário (Fase 3) — o ponto mais crítico

### C1. Zoom automático do iOS

`ui/constants.ts:5` define `CONTROL` com **`text-sm` (14px)**, e esse token é aplicado a
**todos** os campos de entrada:

- `ui/field.tsx:39` → Nome, E-mail, Rua, Bairro, Cidade, Estado, Número, Complemento
- `ui/masked-field.tsx:43` → Celular, CPF/CNPJ, CEP
- `donation-card/birth-date-field.tsx:13` → Nascimento (`type="date"`)
- `donation-card/due-date-field.tsx:13` → Vencimento (`type="date"`)

Além disso, `donation-card/custom-amount-field.tsx:22` traz `text-sm` escrito
diretamente no `<input>` de valor personalizado.

**Resultado: 100% dos 14 campos disparam zoom automático no Safari iOS.** Nenhuma regra
base em `globals.css` protege contra isso.

### C2. Teclado por tipo de campo

| Campo | `type` | `inputMode` | `autoComplete` | Problema |
|---|---|---|---|---|
| Nome completo | text | — | name | falta `autoCapitalize="words"` |
| E-mail | email | email | email | falta `autoCapitalize="off"`, `autoCorrect="off"`, `spellCheck={false}` → teclado capitaliza a 1ª letra e gera e-mail inválido |
| Celular com DDD | tel | tel | tel | OK |
| CPF/CNPJ | text | numeric | — | falta `autoComplete="off"` |
| Nascimento | date | — | bday | `type="date"` nativo (aceitável) |
| CEP | text | numeric | postal-code | OK |
| Rua | text | — | address-line1 | **sem `inputMode`** |
| Bairro | text | — | — | **sem `inputMode` e sem `autoComplete`** |
| Cidade | text | — | address-level2 | **sem `inputMode`** |
| Estado | text | — | address-level1 | **sem `inputMode`**, falta `autoCapitalize="characters"` |
| Número | text | numeric | — | falta `autoComplete`, falta `autoCorrect`/`spellCheck` |
| Complemento | text | — | address-line2 | **sem `inputMode`** |
| Valor personalizado | text | numeric | — | valor monetário → deveria ser `inputMode="decimal"` |
| Vencimento | date | — | — | `type="date"` nativo (aceitável) |

Ponto positivo: **nenhum `type="number"`** no projeto — a regra mais grave da Fase 3.2 já
estava respeitada.

O tipo TypeScript de `inputMode` em `field.tsx:12` e `masked-field.tsx:15` está restrito a
`"numeric" | "tel" | "email" | "text"`, sem `"decimal"` nem `"search"`.

### C3. Teclado virtual e layout

- Nenhum `scroll-margin` em campo algum. Com o card em `overflow-y-auto` e altura travada
  em `92vh`, ao focar o último campo o teclado cobre a entrada.
- Sem `interactiveWidget` declarado no viewport.
- Mensagens de erro **não existem** hoje (o formulário não tem validação visível). Nada a
  reservar — e nada a alterar, já que submit e validação devem permanecer idênticos.

---

## D. Toque e interação (Fase 4)

| # | Elemento | Arquivo | Medida atual | Problema |
|---|---|---|---|---|
| D1 | Botões de valor | `amount-section.tsx:32` (`py-2` + 13px) | ~35px | < 44px |
| D2 | Métodos de pagamento | `payment-section.tsx:32` (`py-2.5`) | ~40px | < 44px |
| D3 | Checkbox de política | `policy-checkbox.tsx:22` (`h-4 w-4`) | 16×16px | muito abaixo de 44px |
| D4 | Link "Políticas de Privacidade" | `policy-checkbox.tsx:26` | linha de 12px | alvo minúsculo |
| D5 | Link "Já sou benfeitor" | `form-header.tsx:16` (`py-2` + 12px) | ~34px | < 44px |
| D6 | Botão FINALIZAR do ritual | `ritual-message.tsx:40` (`py-2.5` + 12px) | ~38px | < 44px |
| D7 | Campos de entrada | `ui/constants.ts:2` (`py-2.5` + 14px) | ~41px | < 44px (resolve junto com C1) |
| D8 | `touch-action` | — | ausente em todo o projeto exceto `draggable-candle.tsx:35` | delay de 300ms e realce cinza no tap |

### Casos de `:hover` sem equivalente mobile

| # | Local | Comportamento | Impacto real |
|---|---|---|---|
| H1 | `option-button.tsx:26` | `hover:border-[#d9c9a3]/60` | Apenas realce; o estado `active` já comunica seleção por toque. **Sem perda de informação.** |
| H2 | `frequency-option-button.tsx:32` | `hover:border-[#d9c9a3]/50` | Idem H1. |
| H3 | `form-header.tsx:16` | `hover:border/bg` no link | Decorativo. |
| H4 | `policy-checkbox.tsx:28` | `hover:text-[#f0e2c0]` no link | Decorativo — o link já é sublinhado e dourado. |
| H5 | `submit-button.tsx:15` / `light-candle-button.tsx:16` | `hover:opacity-90` | Decorativo. |
| H6 | `ritual-message.tsx:40` | `hover:border/bg` | Decorativo. |
| H7 | `light-candle-button.tsx:21` | `group-hover:scale-110` no ícone | Decorativo. |
| H8 | `RECURRING_BLOCKED_NOTE` (`frequency-option-button.tsx:45`) | "Escolha PIX auto ou carnê" | **Já é sempre visível** — não depende de hover. |
| H9 | `section-label.tsx:14` — ícone `Info` | Ícone informativo **sem tooltip e sem handler** | Não há informação escondida atrás de hover; hoje é puramente decorativo. |

**Conclusão da Fase 4/hover: nenhum caso de informação exclusiva de hover.** Todos os
`:hover` do projeto são realces decorativos cujo equivalente (`active`, sublinhado, texto
sempre visível) já existe no mobile. Nada precisa ser convertido — apenas garantir
feedback de toque.

---

## E. Animação (Fase 5)

| # | Item | Arquivo | Situação |
|---|---|---|---|
| E1 | Card entra com `x: 40` | `donation-card/index.tsx:19` | Desloca 40px para a direita no estado inicial. Com o card ancorado à direita, empurra para fora da viewport durante toda a animação. |
| E2 | `Collapse` anima `height` e `marginTop` | `animation/collapse.tsx:18-20` | Anima propriedades de layout (reflow). Contraria a Fase 5, mas trocar exigiria mudança visível de animação — **registrado, não alterado**. |
| E3 | `prefers-reduced-motion` | `donation-experience.tsx:16` | `<MotionConfig reducedMotion="user">` já cobre todo o Motion; não há animação CSS pura no projeto. **OK.** |
| E4 | Canvas da chama | `flame/use-flame-canvas.ts` | Loop de partículas em `requestAnimationFrame`. Pode pesar em device fraco — **registrado, não alterado**. |
| E5 | `HeroBackground` `scale: 1.06` | `hero-background.tsx:11` | Escala além da viewport; contido pelo `overflow-hidden` do `main` — uso legítimo de recorte local. |

---

## F. Imagem e mídia (Fase 6)

| # | Item | Arquivo | Situação |
|---|---|---|---|
| F1 | `padre.png` | `hero-priest.tsx:8` | Usa `motion.img` (tag nativa), **não `next/image`** — sem otimização, sem `sizes`, sem `width`/`height`. Mobile baixa o PNG de desktop inteiro. |
| F2 | `background.png` (poster) | `video-poster.tsx` | `next/image` com `fill`, `priority`, `sizes="100vw"`. **OK.** |
| F3 | `background-video.mp4` | `background-video/constants.ts` | Fonte única, sem variante mobile. **Registrado** — gerar encode mobile está fora do escopo de layout. |
| F4 | Assinatura SVG | `hero-signature/index.tsx` | SVG inline com `viewBox`. Sem CLS. **OK.** |

---

## G. Tipografia (Fase 7)

| # | Item | Arquivo | Tamanho |
|---|---|---|---|
| G1 | `CONTROL` (campos) | `ui/constants.ts:5` | 14px — **viola o piso de 16px** |
| G2 | Label do `LabeledField` | `ui/labeled-field.tsx:22` | 10px |
| G3 | Nota do `FrequencyOptionButton` | `frequency-option-button.tsx:44` | 10px |
| G4 | `SectionLabel` | `section-label.tsx:11` | 11px |
| G5 | `SecureNote` | `secure-note.tsx:5` | 11px |
| G6 | `StatusLabel` | `status-label.tsx:16` | 11px |
| G7 | `PolicyCheckbox` | `policy-checkbox.tsx:15` | 12px |
| G8 | `FormHeader` parágrafo | `form-header.tsx:11` | 12px (`text-xs`) |
| G9 | `DragHint` | `drag-hint.tsx:15` | 12px |
| G10 | Padding lateral | — | `px-16` no hero vs `p-5` no card vs `px-8` no ritual — inconsistente no mobile |

G2–G9 estão abaixo de 14px. São rótulos e microcopy, **não corpo de texto**; a regra de
ouro proíbe mudança de identidade visual e subi-los alteraria a hierarquia tipográfica no
desktop. **Mantidos e registrados** — exceto onde o piso de 16px dos campos manda (G1),
que é regra inegociável da Fase 3.1.

---

## Correções aplicadas

Ver o relatório completo em `MOBILE-REPORT.md`. Resumo por item da auditoria:

| Item | Correção | Arquivo |
|---|---|---|
| A1, B3, E1 | Card entra no fluxo no mobile (`w-full max-w-[510px]`, sem altura travada); volta a painel flutuante de 510px em `lg`. `overflow-x-clip` **no wrapper pai** contém o `x: 40` da animação. | `donation-card/index.tsx` |
| A2, B4, F1 | `motion.img` → `next/image` com `sizes`, `width`/`height` reais (1159×1358). Largura manda no mobile, altura volta a mandar em `lg` (`85dvh`). | `hero/hero-priest.tsx` |
| A3 | Assinatura fluida (`w-[72vw] max-w-[400px]`, centralizada); enquadramento de hoje preservado em `lg`. | `hero/index.tsx` |
| A4 | `break-words` no título, sem alterar o `text-[11vw]`. | `hero-copy/hero-title.tsx` |
| A5 | `px-16` → `px-4 sm:px-8 lg:px-16`. | `hero-copy/index.tsx` |
| A6 | `whitespace-nowrap` só a partir de `sm`; largura máxima e centralização no mobile. | `candle-ritual/drag-hint.tsx` |
| A7, D1 | `min-h-11` (44px) no `OptionButton`. Célula de 77px em 320px comporta "R$ 200,00". | `ui/option-button.tsx` |
| A8–A13 | `min-w-0` no `FRAME`, no `CONTROL` e no `LabeledField`, permitindo o encolhimento dos flex items. | `ui/constants.ts`, `ui/labeled-field.tsx` |
| A12 | `min-w-0` + gap/padding menores no mobile no botão de frequência. | `frequency-option-button.tsx` |
| A14 | `max-w-[92vw]` + `whitespace-nowrap` nas inscrições, sem reposicionar nada. | `revealed-inscription.tsx` |
| B1 | `export const viewport` com `width=device-width`, `initial-scale=1`, `viewport-fit=cover`, `interactive-widget=resizes-visual`. **Sem** `maximum-scale`/`user-scalable`. | `app/layout.tsx` |
| B2 | `min-h-screen` → `.min-h-dvh-fallback` (100vh + `@supports` 100dvh). | `globals.css`, `donation-experience.tsx` |
| B5 | `env(safe-area-inset-bottom)` no card e no bloco do ritual; `inset-top` na dica de arraste. | `donation-card/index.tsx`, `ritual-message.tsx`, `drag-hint.tsx` |
| C1 | `CONTROL` 14px → **16px**, com `py-2.5`→`py-2` compensando: **altura final idêntica** (40px). Regra base global em `globals.css` como rede de segurança. | `ui/constants.ts`, `globals.css` |
| C2 | Mapeamento completo de teclado nos 14 campos; `inputMode` agora tem default `"text"`, então nenhum campo fica sem ele. | seções do formulário |
| C3 | `scroll-margin-block: 6rem` global nos campos; no mobile quem rola é a página, não o card. | `globals.css`, `donation-form.tsx` |
| D2–D6 | `min-h-11` em todos os botões e links de ação; checkbox com alvo de 44px via `py-2.5` (com `mt` compensado). | vários |
| D8 | `touch-action: manipulation` + `-webkit-tap-highlight-color: transparent`. | `globals.css` |

### Registrado, não alterado (exigiria mudança visual ou saía do escopo)

- **E2** `Collapse` anima `height`/`marginTop` (reflow) — trocar mudaria a animação.
- **E4** canvas de partículas da chama — pode pesar em device fraco.
- **F3** `background-video.mp4` sem variante mobile — gerar encode está fora do escopo de layout.
- **G2–G9** microcopy entre 10px e 12px — subir alteraria a hierarquia tipográfica no desktop.
- **`main.overflow-hidden`** trocado por `overflow-x-clip` (preserva a rolagem vertical), mantido como recorte legítimo do palco do hero — mas agora sem causas de overflow escondidas atrás dele.
