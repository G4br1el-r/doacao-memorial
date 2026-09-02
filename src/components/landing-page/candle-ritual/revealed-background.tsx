import { INSCRIPTIONS } from "./constants";
import { RevealedInscription } from "./revealed-inscription";
import { StoneArches } from "./stone-arches";

export function RevealedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 select-none">
      {INSCRIPTIONS.map((inscription) => (
        <RevealedInscription key={inscription.text} inscription={inscription} />
      ))}
      <StoneArches />
    </div>
  );
}
