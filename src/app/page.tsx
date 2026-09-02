"use client";

import {
  Barcode,
  CalendarDays,
  CreditCard,
  FileText,
  Hash,
  Heart,
  IdCard,
  Info,
  Lock,
  Mail,
  MapPin,
  Phone,
  QrCode,
  Repeat,
  User,
  UserCheck,
} from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useId, useState } from "react";
import { IMaskInput } from "react-imask";
import { Assinatura } from "@/components/landinpage/hero/assinatura";
import { BackgroundVideo } from "@/components/landinpage/hero/background-video";
import { VelaRitual } from "@/components/vela-ritual";
import { Agradecimento } from "@/components/vela-ritual/agradecimento";

/* decrescente, como na referencia - o primeiro e o padrao */
const VALORES = [200, 100, 75, 50, 25];

type Forma = {
  id: "pix-auto" | "pix" | "credito" | "boleto" | "carne";
  rotulo: string;
  icone: React.ElementType;
  /* cobra de novo sozinha - so essas aceitam doacao mensal */
  recorrente?: boolean;
};

const FORMAS_PAGAMENTO: Forma[] = [
  { id: "pix-auto", rotulo: "PIX automático", icone: QrCode, recorrente: true },
  { id: "pix", rotulo: "PIX", icone: QrCode },
  { id: "credito", rotulo: "Crédito", icone: CreditCard, recorrente: true },
  { id: "boleto", rotulo: "Boleto", icone: Barcode },
  { id: "carne", rotulo: "Carnê digital", icone: FileText, recorrente: true },
];

type FormaPagamento = Forma["id"];

/* easing suave, sem "mola" - combina com o tom do site */
const SUAVE = [0.22, 1, 0.36, 1] as const;

/* cada bloco do card entra na vez, orquestrado pelo container */
const itemCard = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: SUAVE } },
};

/* titulo revelado letra por letra */
function TituloLetras({
  texto,
  delayBase,
}: {
  texto: string;
  delayBase: number;
}) {
  return (
    <span className="inline-block">
      {texto.split("").map((letra, i) => (
        <motion.span
          // biome-ignore lint/suspicious/noArrayIndexKey: texto estatico, a lista nunca reordena
          key={`${texto}-${letra}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.9,
            delay: delayBase + i * 0.05,
            ease: SUAVE,
          }}
        >
          {letra === " " ? "\u00A0" : letra}
        </motion.span>
      ))}
    </span>
  );
}

/* label de secao com filete dourado ao lado */
function SectionLabel({
  children,
  info,
}: {
  children: React.ReactNode;
  info?: boolean;
}) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="text-[11px] font-medium tracking-[0.2em] text-[#d9c9a3]">
        {children}
      </span>
      {info && <Info className="h-3.5 w-3.5 text-[#d9c9a3]/70" />}
      <span className="h-px flex-1 bg-linear-to-r from-[#d9c9a3]/40 to-transparent" />
    </div>
  );
}

/* moldura compartilhada por input e select, pra borda/foco nao divergirem */
const MOLDURA =
  "flex flex-1 items-center gap-3 rounded-lg border border-[#d9c9a3]/25 bg-white/8 px-3.5 py-2.5 transition-colors focus-within:border-[#d9c9a3]/70";

const CONTROLE =
  "w-full bg-transparent text-sm text-white placeholder:text-white/45 focus:outline-none";

/* asterisco discreto pra nao competir com o texto do campo */
function Obrigatorio() {
  return <span className="text-[#d9c9a3]/70">*</span>;
}

/* input com icone a esquerda */
function Field({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
  obrigatorio,
  inputMode,
  maxLength,
  autoComplete,
}: {
  icon: React.ElementType;
  placeholder: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  obrigatorio?: boolean;
  inputMode?: "numeric" | "tel" | "email" | "text";
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <label className={MOLDURA}>
      <Icon className="h-4 w-4 shrink-0 text-[#d9c9a3]/80" />
      <input
        type={type}
        inputMode={inputMode}
        maxLength={maxLength}
        autoComplete={autoComplete}
        value={value}
        onChange={onChange && ((e) => onChange(e.target.value))}
        placeholder={obrigatorio ? `${placeholder} *` : placeholder}
        className={CONTROLE}
      />
    </label>
  );
}

/* mesmo visual do Field, mas com a mascara da lib cuidando do formato.
   `mask` aceita um array pra alternar sozinho conforme o tamanho - e assim
   que o CPF vira CNPJ quando o 12o digito entra */
function FieldMascarado({
  icon: Icon,
  placeholder,
  mask,
  type = "text",
  value,
  onAccept,
  obrigatorio,
  inputMode,
  autoComplete,
}: {
  icon: React.ElementType;
  placeholder: string;
  /* string simples, ou a lista de alternativas que a lib escolhe pelo
     tamanho. o tipo da lib e uma uniao de ~23 overloads que o TS nao
     estreita a partir de um prop repassado, dai o cast la embaixo */
  mask: string | { mask: string; maxLength?: number }[];
  type?: string;
  value: string;
  onAccept: (v: string) => void;
  obrigatorio?: boolean;
  inputMode?: "numeric" | "tel" | "email" | "text";
  autoComplete?: string;
}) {
  /* o IMaskInput e um componente, entao o label precisa do htmlFor
     explicito - o lint nao enxerga o input la dentro */
  const id = useId();
  return (
    <label htmlFor={id} className={MOLDURA}>
      <Icon className="h-4 w-4 shrink-0 text-[#d9c9a3]/80" />
      <IMaskInput
        id={id}
        mask={mask as unknown as string}
        value={value}
        /* o unmask fica de fora: o valor exibido e o enviado sao o mesmo,
           entao a formatacao nao se perde ao remontar */
        onAccept={onAccept}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={obrigatorio ? `${placeholder} *` : placeholder}
        className={CONTROLE}
      />
    </label>
  );
}

/* campo com rotulo em cima - usado onde o formato importa (data, sexo) */
function FieldRotulado({
  icon: Icon,
  rotulo,
  obrigatorio,
  children,
}: {
  icon: React.ElementType;
  rotulo: string;
  obrigatorio?: boolean;
  /* recebe o id para amarrar o controle ao label */
  children: (id: string) => React.ReactNode;
}) {
  const id = useId();
  return (
    <div className="flex flex-1 flex-col gap-1 rounded-lg border border-[#d9c9a3]/25 bg-white/8 px-3.5 py-2 transition-colors focus-within:border-[#d9c9a3]/70">
      <label htmlFor={id} className="text-[10px] tracking-wide text-white/55">
        {rotulo}
        {obrigatorio && <Obrigatorio />}
      </label>
      <span className="flex items-center gap-3">
        <Icon className="h-4 w-4 shrink-0 text-[#d9c9a3]/80" />
        {children(id)}
      </span>
    </div>
  );
}

/* mantem so os digitos, sem zeros a esquerda */
function digitosDe(texto: string) {
  return texto
    .replace(/\D/g, "")
    .replace(/^0+(?=\d)/, "")
    .slice(0, 11);
}

/* os digitos sao centavos: "1250" vira "12,50" */
function formatarCentavos(digitos: string) {
  if (!digitos) return "";
  const cheio = digitos.padStart(3, "0");
  const reais = Number(cheio.slice(0, -2));
  return `${reais.toLocaleString("pt-BR")},${cheio.slice(-2)}`;
}

/* so os digitos, no formato 00000-000 */
export default function Home() {
  const [valor, setValor] = useState<number | "outro">(VALORES[0]);
  const [outroValor, setOutroValor] = useState("");
  const [recorrencia, setRecorrencia] = useState<"mensal" | "unica">("mensal");
  const [pagamento, setPagamento] = useState<FormaPagamento>("pix-auto");
  const [aceito, setAceito] = useState(false);
  const [nome, setNome] = useState("");
  const [celular, setCelular] = useState("");
  const [documento, setDocumento] = useState("");
  /* demo: o ritual abre direto no clique, sem pagamento por tras */
  const [ritualAberto, setRitualAberto] = useState(false);
  /* o card vira agradecimento no lugar - o doador nao volta ao
     formulario depois de doar */
  const [etapa, setEtapa] = useState<"formulario" | "obrigado">("formulario");
  /* mora aqui e nao no card para sobreviver a ida e volta do ritual */
  const [doacaoConfirmada, setDoacaoConfirmada] = useState(false);

  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState({
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });
  const [buscandoCep, setBuscandoCep] = useState(false);

  /* ao acender a vela o card volta pro formulario zerado, pronto pra uma
     nova doacao - a vela fica por cima enquanto isso, entao a troca
     acontece escondida atras do overlay */
  function reiniciarFormulario() {
    setValor(VALORES[0]);
    setOutroValor("");
    setRecorrencia("mensal");
    setPagamento("pix-auto");
    setAceito(false);
    setNome("");
    setCelular("");
    setDocumento("");
    setCep("");
    setEndereco({
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    });
    setDoacaoConfirmada(false);
    setEtapa("formulario");
  }

  /* ao completar os 8 digitos, preenche o endereco sozinho */
  /* chega ja formatado pela mascara; so os 8 digitos disparam a busca */
  async function aoDigitarCep(formatado: string) {
    setCep(formatado);

    const digitos = formatado.replace(/\D/g, "");
    if (digitos.length !== 8) return;

    setBuscandoCep(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digitos}/json/`);
      const d = await r.json();
      if (!d.erro) {
        setEndereco((atual) => ({
          ...atual,
          rua: d.logradouro ?? "",
          bairro: d.bairro ?? "",
          cidade: d.localidade ?? "",
          estado: d.uf ?? "",
        }));
      }
    } catch {
      /* offline ou cep invalido: o doador preenche na mao */
    } finally {
      setBuscandoCep(false);
    }
  }

  /* recorrencia so faz sentido nas formas que cobram de novo */
  const formaAtual = FORMAS_PAGAMENTO.find((f) => f.id === pagamento);
  const permiteRecorrencia = Boolean(formaAtual?.recorrente);

  const valorFinal =
    valor === "outro"
      ? outroValor
        ? String(Number(outroValor) / 100)
        : ""
      : String(valor);
  const rotuloValor = valorFinal
    ? `R$ ${Number(valorFinal).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    : "";

  /* so libera com politica aceita e valor definido */
  /* biome-ignore lint/correctness/noUnusedVariables: a demo deixa o botao
     sempre ativo; esta regra volta a valer quando houver pagamento */
  const podeDoar = aceito && valorFinal !== "";

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-screen overflow-hidden bg-black">
        {/* background: a imagem aparece primeiro; o video entra por cima ao carregar */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, ease: SUAVE }}
        >
          <BackgroundVideo poster="/background.png" />
        </motion.div>

        {/* padre: absolute, sempre centralizado na tela */}
        <motion.img
          src="/padre.png"
          alt="Padre"
          className="absolute bottom-0 left-1/2 z-10 h-[85vh] w-auto max-w-none -translate-x-1/2 object-contain"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8, delay: 0.3, ease: SUAVE }}
        />

        {/* degrade: preto no bottom subindo ate transparente */}
        <div className="absolute bottom-0 left-0 z-20 h-1/2 w-full bg-linear-to-t from-black to-transparent" />

        {/* assinatura: embaixo do padre, escrita a mao */}
        <Assinatura className="absolute bottom-12 left-[42%] z-30 w-[400px] max-w-none -translate-x-1/2" />

        {/* bloco de texto: titulo ATRAS do padre, paragrafo POR CIMA */}
        <div className="absolute inset-0 flex flex-col justify-center px-16">
          <motion.div
            className="flex items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: SUAVE }}
          >
            <span className="text-base tracking-[0.3em] text-[#d9c9a3]">
              FAÇA PARTE
            </span>
            <motion.span
              className="h-px bg-[#d9c9a3]/60"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 1.2, delay: 0.6, ease: SUAVE }}
            />
          </motion.div>

          <h1 className="mt-3 font-display text-[11vw] font-bold uppercase leading-[0.86] tracking-[0.01em] text-[#e8dcc0]">
            <TituloLetras texto="De algo" delayBase={0.5} />
            <br />
            <TituloLetras texto="maior" delayBase={0.85} />
          </h1>

          <motion.p
            className="relative z-30 mt-8 max-w-md text-lg leading-relaxed text-white/90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.5, ease: SUAVE }}
          >
            Sua doação mantém viva esta missão de fé, evangelização e caridade.
          </motion.p>
        </div>

        {/* ============ CARD DE DOACAO ============ */}
        <motion.div
          className="absolute right-10 top-1/2 z-40 flex max-h-[92vh] w-[510px] -translate-y-1/2 flex-col"
          initial={{ opacity: 0, x: 40 }}
          /* some enquanto o ritual roda: montado atras do overlay ele
             ainda receberia clique, e o `inert` impede o foco de cair
             num campo invisivel */
          animate={{ opacity: ritualAberto ? 0 : 1, x: 0 }}
          inert={ritualAberto}
          transition={{ duration: 1.4, delay: 0.8, ease: SUAVE }}
        >
          {/* `mode="wait"` para o formulario terminar de sair antes do
              obrigado entrar - os dois no mesmo lugar se sobreporiam */}
          <AnimatePresence mode="wait">
            {etapa === "formulario" ? (
              <motion.div
                key="formulario"
                className="flex min-h-0 flex-col overflow-y-auto overscroll-contain rounded-2xl border border-[#d9c9a3]/20 bg-black/55 p-5 shadow-xl backdrop-blur-xl [scrollbar-color:rgba(217,201,163,0.35)_transparent] [scrollbar-width:thin]"
                initial="hidden"
                animate="show"
                exit={{
                  opacity: 0,
                  y: -16,
                  transition: { duration: 0.5, ease: SUAVE },
                }}
                variants={{
                  hidden: {},
                  show: {
                    transition: { delayChildren: 1.2, staggerChildren: 0.14 },
                  },
                }}
              >
                {/* cabecalho */}
                <motion.div className="text-center" variants={itemCard}>
                  <span className="text-lg text-[#d9c9a3]">✦</span>
                  <h2 className="mt-1 font-serif text-2xl font-medium tracking-[0.08em] text-[#e8dcc0]">
                    FAÇA SUA DOAÇÃO
                  </h2>
                  <p className="mx-auto mt-2 max-w-65 text-xs leading-relaxed text-white/70">
                    Preencha seus dados para continuarmos juntos nessa missão.
                  </p>
                  <a
                    href="/benfeitor"
                    className="mt-3 inline-flex items-center justify-center gap-2 rounded-lg border border-[#d9c9a3]/40 bg-white/5 px-4 py-2 text-[12px] tracking-wide text-[#e8dcc0] transition-colors hover:border-[#d9c9a3]/80 hover:bg-[#d9c9a3]/10"
                  >
                    <UserCheck className="h-4 w-4" />
                    Já sou benfeitor
                  </a>
                </motion.div>

                {/* seus dados */}
                <motion.div className="mt-4" variants={itemCard}>
                  <SectionLabel>SEUS DADOS</SectionLabel>
                  {/* nome ocupa a linha inteira - e o campo mais longo do form */}
                  <div className="flex">
                    <Field
                      icon={User}
                      placeholder="Nome completo"
                      autoComplete="name"
                      value={nome}
                      onChange={setNome}
                      obrigatorio
                    />
                  </div>

                  {/* e-mail logo abaixo do nome e com a mesma largura: os dois
                  sao os campos que mais crescem em texto */}
                  <div className="mt-3 flex">
                    <Field
                      icon={Mail}
                      placeholder="E-mail"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                    />
                  </div>

                  <div className="mt-3 flex gap-3">
                    <FieldMascarado
                      icon={Phone}
                      placeholder="Celular com DDD"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      mask="(00) 00000-0000"
                      value={celular}
                      onAccept={setCelular}
                      obrigatorio
                    />
                    {/* os 11 digitos do CPF vem primeiro: passando disso a
                    propria lib troca pela mascara de CNPJ */}
                    <FieldMascarado
                      icon={IdCard}
                      placeholder="CPF/CNPJ"
                      inputMode="numeric"
                      mask={[
                        { mask: "000.000.000-00", maxLength: 11 },
                        { mask: "00.000.000/0000-00" },
                      ]}
                      value={documento}
                      onAccept={setDocumento}
                      obrigatorio
                    />
                  </div>

                  {/* meia linha: sozinho e esticado, o campo de data ficaria
                  com um vazio enorme depois do dd/mm/aaaa */}
                  <div className="mt-3 flex w-1/2 gap-3 pr-1.5">
                    <FieldRotulado
                      icon={CalendarDays}
                      rotulo="Nascimento"
                      obrigatorio
                    >
                      {(id) => (
                        <input
                          id={id}
                          type="date"
                          autoComplete="bday"
                          className={`${CONTROLE} [color-scheme:dark]`}
                        />
                      )}
                    </FieldRotulado>
                  </div>
                </motion.div>

                {/* endereco: o cep preenche o resto */}
                <motion.div className="mt-4" variants={itemCard}>
                  <SectionLabel>ENDEREÇO</SectionLabel>
                  {/* cada linha e um flex proprio em vez de um grid corrido:
                  assim cep e estado ficam sozinhos na linha sem depender de
                  quantas colunas os vizinhos ocuparam */}
                  <div className="flex">
                    <div className="w-1/3 pr-1.5">
                      <FieldMascarado
                        icon={MapPin}
                        placeholder={buscandoCep ? "Buscando…" : "CEP"}
                        inputMode="numeric"
                        autoComplete="postal-code"
                        mask="00000-000"
                        value={cep}
                        onAccept={aoDigitarCep}
                        obrigatorio
                      />
                    </div>
                  </div>

                  <div className="mt-3 flex">
                    <Field
                      icon={MapPin}
                      placeholder="Rua"
                      autoComplete="address-line1"
                      value={endereco.rua}
                      onChange={(v) => setEndereco({ ...endereco, rua: v })}
                    />
                  </div>

                  <div className="mt-3 flex gap-3">
                    <Field
                      icon={MapPin}
                      placeholder="Bairro"
                      value={endereco.bairro}
                      onChange={(v) => setEndereco({ ...endereco, bairro: v })}
                    />
                    <Field
                      icon={MapPin}
                      placeholder="Cidade"
                      autoComplete="address-level2"
                      value={endereco.cidade}
                      onChange={(v) => setEndereco({ ...endereco, cidade: v })}
                    />
                  </div>

                  <div className="mt-3 flex">
                    <Field
                      icon={MapPin}
                      placeholder="Estado"
                      maxLength={2}
                      autoComplete="address-level1"
                      value={endereco.estado}
                      onChange={(v) =>
                        setEndereco({ ...endereco, estado: v.toUpperCase() })
                      }
                    />
                  </div>

                  {/* numero e complemento por ultimo: o cep preenche o resto,
                  entao sao os unicos que sobram pro doador digitar */}
                  <div className="mt-3 flex gap-3">
                    <Field
                      icon={Hash}
                      placeholder="Número"
                      inputMode="numeric"
                      value={endereco.numero}
                      onChange={(v) => setEndereco({ ...endereco, numero: v })}
                      obrigatorio
                    />
                    <Field
                      icon={MapPin}
                      placeholder="Complemento"
                      autoComplete="address-line2"
                      value={endereco.complemento}
                      onChange={(v) =>
                        setEndereco({ ...endereco, complemento: v })
                      }
                    />
                  </div>
                </motion.div>

                {/* tipo da doacao: primeira escolha, como na referencia */}
                <motion.div className="mt-4" variants={itemCard}>
                  <SectionLabel info>TIPO DA DOAÇÃO</SectionLabel>
                  <div className="flex gap-3">
                    {(
                      [
                        { id: "mensal", rotulo: "Mensal", nota: "Todo mês" },
                        { id: "unica", rotulo: "Único", nota: "Uma única vez" },
                      ] as const
                    ).map((op) => {
                      const ativo = recorrencia === op.id;
                      /* mensal exige uma forma que cobre sozinha */
                      const bloqueado =
                        op.id === "mensal" && !permiteRecorrencia;
                      return (
                        <button
                          key={op.id}
                          type="button"
                          disabled={bloqueado}
                          onClick={() => setRecorrencia(op.id)}
                          className={`flex flex-1 items-center gap-3 rounded-lg border px-3.5 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                            ativo
                              ? "border-[#d9c9a3]/80 bg-[#d9c9a3]/10"
                              : "border-[#d9c9a3]/25 bg-black/40 hover:border-[#d9c9a3]/50"
                          }`}
                        >
                          {op.id === "mensal" ? (
                            <Repeat
                              className={`h-5 w-5 shrink-0 ${ativo ? "text-[#d9c9a3]" : "text-[#d9c9a3]/70"}`}
                            />
                          ) : (
                            <Heart
                              className={`h-5 w-5 shrink-0 ${ativo ? "fill-[#d9c9a3] text-[#d9c9a3]" : "text-[#d9c9a3]/70"}`}
                            />
                          )}
                          <span>
                            <span className="block text-sm text-white">
                              {op.rotulo}
                            </span>
                            <span className="block text-[10px] leading-tight text-white/60">
                              {bloqueado
                                ? "Escolha PIX auto ou carnê"
                                : op.nota}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>

                {/* sua contribuicao */}
                <motion.div className="mt-4" variants={itemCard}>
                  <SectionLabel>SUA CONTRIBUIÇÃO</SectionLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {VALORES.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setValor(v)}
                        className={`rounded-lg border py-2 text-[13px] transition-colors ${
                          valor === v
                            ? "border-[#d9c9a3] bg-[#d9c9a3] font-semibold text-black"
                            : "border-[#d9c9a3]/25 bg-white/8 text-white/80 hover:border-[#d9c9a3]/60"
                        }`}
                      >
                        R$ {v},00
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setValor("outro")}
                      className={`rounded-lg border py-2 text-[13px] transition-colors ${
                        valor === "outro"
                          ? "border-[#d9c9a3] bg-[#d9c9a3] font-semibold text-black"
                          : "border-[#d9c9a3]/25 bg-white/8 text-white/80 hover:border-[#d9c9a3]/60"
                      }`}
                    >
                      Outro
                    </button>
                  </div>

                  {/* o campo livre so aparece quando ele e a escolha */}
                  <AnimatePresence initial={false}>
                    {valor === "outro" && (
                      <motion.div
                        className="flex items-stretch gap-3 overflow-hidden"
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.35, ease: SUAVE }}
                      >
                        <span className="flex items-center rounded-lg border border-[#d9c9a3]/25 bg-white/8 px-4 text-sm font-medium text-[#d9c9a3]">
                          R$
                        </span>
                        <input
                          /* centavos entram sozinhos, da direita pra esquerda:
                         digitar 1 2 5 0 vira 12,50 sem teclar a virgula */
                          type="text"
                          inputMode="numeric"
                          value={formatarCentavos(outroValor)}
                          onChange={(e) =>
                            setOutroValor(digitosDe(e.target.value))
                          }
                          placeholder="Digite outro valor"
                          className="flex-1 rounded-lg border border-[#d9c9a3]/25 bg-white/8 px-3.5 py-2.5 text-sm text-white placeholder:text-white/45 focus:border-[#d9c9a3]/70 focus:outline-none"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* forma de pagamento */}
                <motion.div className="mt-4" variants={itemCard}>
                  <SectionLabel>FORMA DE DOAÇÃO</SectionLabel>
                  <div className="flex flex-wrap gap-2">
                    {FORMAS_PAGAMENTO.map((forma) => {
                      const Icone = forma.icone;
                      const ativa = pagamento === forma.id;
                      return (
                        <button
                          key={forma.id}
                          type="button"
                          onClick={() => {
                            setPagamento(forma.id);
                            /* forma avulsa nao sustenta mensal: volta pra unica */
                            if (!forma.recorrente) setRecorrencia("unica");
                          }}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[13px] transition-colors ${
                            ativa
                              ? "border-[#d9c9a3] bg-[#d9c9a3] font-semibold text-black"
                              : "border-[#d9c9a3]/25 bg-white/8 text-white/80 hover:border-[#d9c9a3]/60"
                          }`}
                        >
                          <Icone className="h-4 w-4 shrink-0" />
                          {forma.rotulo}
                        </button>
                      );
                    })}
                  </div>

                  {/* vencimento: so faz sentido em boleto e carne */}
                  <AnimatePresence initial={false}>
                    {(pagamento === "boleto" || pagamento === "carne") && (
                      <motion.div
                        className="overflow-hidden"
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: "auto", opacity: 1, marginTop: 12 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.35, ease: SUAVE }}
                      >
                        <div className="flex w-1/2">
                          <FieldRotulado
                            icon={CalendarDays}
                            rotulo="Data de vencimento"
                            obrigatorio
                          >
                            {(id) => (
                              <input
                                id={id}
                                type="date"
                                className={`${CONTROLE} [color-scheme:dark]`}
                              />
                            )}
                          </FieldRotulado>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* politicas */}
                <motion.label
                  className="mt-4 flex cursor-pointer items-center gap-3 text-[12px] text-white/75"
                  variants={itemCard}
                >
                  <input
                    type="checkbox"
                    checked={aceito}
                    onChange={(e) => setAceito(e.target.checked)}
                    className="h-4 w-4 shrink-0 cursor-pointer accent-[#d9c9a3]"
                  />
                  <span>
                    Li e aceito as{" "}
                    <a
                      href="/politicas-de-privacidade"
                      className="text-[#d9c9a3] underline underline-offset-2 hover:text-[#f0e2c0]"
                    >
                      Políticas de Privacidade
                    </a>
                    <Obrigatorio />
                  </span>
                </motion.label>

                {/* cta */}
                <button
                  type="button"
                  /* demo: sempre ativo para o cliente ver o ritual sem
                 precisar preencher o formulario. na versao real volta a
                 depender de `podeDoar` */
                  onClick={() => setEtapa("obrigado")}
                  className="mt-4 flex w-full items-center justify-center gap-3 rounded-lg bg-linear-to-r from-[#c9b184] via-[#f0e2c0] to-[#c9b184] py-3 text-[13px] font-semibold tracking-[0.15em] text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Heart className="h-4 w-4 fill-current" />
                  {rotuloValor ? `DOAR ${rotuloValor}` : "CONTRIBUIR AGORA"}
                </button>

                <p className="mt-4 flex items-center justify-center gap-2 text-[11px] text-white/60">
                  <Lock className="h-3 w-3" />
                  Ambiente seguro e protegido
                </p>
              </motion.div>
            ) : (
              <Agradecimento
                key="obrigado"
                nome={nome}
                valor={rotuloValor}
                jaConfirmado={doacaoConfirmada}
                onConfirmado={() => setDoacaoConfirmada(true)}
                onAcenderVela={() => {
                  setRitualAberto(true);
                  reiniciarFormulario();
                }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <VelaRitual
        aberto={ritualAberto}
        onFechar={() => setRitualAberto(false)}
      />
    </MotionConfig>
  );
}
