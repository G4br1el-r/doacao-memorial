interface ThankYouMessageProps {
  firstName?: string;
  amount?: string;
}

export function ThankYouMessage({ firstName, amount }: ThankYouMessageProps) {
  return (
    <>
      <h2 className="mt-6 font-serif text-4xl font-medium leading-tight text-[#e8dcc0] sm:text-5xl">
        {firstName ? `Obrigado, ${firstName}.` : "Obrigado."}
      </h2>

      <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-white/75">
        {amount ? (
          <>
            Sua doação de <span className="text-[#e8dcc0]">{amount}</span> foi
            recebida. Ela sustenta a missão de fé, evangelização e caridade que
            segue viva por aqui.
          </>
        ) : (
          <>
            Sua doação foi recebida. Ela sustenta a missão de fé, evangelização
            e caridade que segue viva por aqui.
          </>
        )}
      </p>
    </>
  );
}
