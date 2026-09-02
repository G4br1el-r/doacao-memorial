import { NextResponse } from "next/server";

const VIACEP_URL = "https://viacep.com.br/ws";
const POSTAL_CODE_LENGTH = 8;
const TIMEOUT_MS = 5000;
const CACHE_SECONDS = 60 * 60 * 24;

type ViaCepResponse = {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean | string;
};

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/cep/[cep]">,
) {
  const { cep } = await ctx.params;
  const digits = cep.replace(/\D/g, "");

  if (digits.length !== POSTAL_CODE_LENGTH) {
    return NextResponse.json(
      { error: "CEP inválido" },
      { status: 400, headers: { "cache-control": "no-store" } },
    );
  }

  try {
    const response = await fetch(`${VIACEP_URL}/${digits}/json/`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: "application/json" },
      next: { revalidate: CACHE_SECONDS },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Não foi possível consultar o CEP" },
        { status: 502, headers: { "cache-control": "no-store" } },
      );
    }

    const data = (await response.json()) as ViaCepResponse;

    if (data.erro) {
      return NextResponse.json(
        { error: "CEP não encontrado" },
        { status: 404, headers: { "cache-control": "no-store" } },
      );
    }

    return NextResponse.json(
      {
        rua: data.logradouro ?? "",
        bairro: data.bairro ?? "",
        cidade: data.localidade ?? "",
        estado: data.uf ?? "",
      },
      {
        headers: {
          "cache-control": `public, max-age=${CACHE_SECONDS}, stale-while-revalidate=${CACHE_SECONDS}`,
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Não foi possível consultar o CEP" },
      { status: 502, headers: { "cache-control": "no-store" } },
    );
  }
}
