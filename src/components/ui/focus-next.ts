const FOCUSABLE =
  "input:not([type='hidden']):not([type='checkbox']):not([type='radio']):not([disabled]), select, textarea";

export function focusNextField(current: HTMLElement) {
  const form = current.closest("[data-field-flow]") ?? document.body;
  const fields = Array.from(form.querySelectorAll<HTMLElement>(FOCUSABLE));
  const next = fields[fields.indexOf(current) + 1];

  if (!next) {
    current.blur();
    return;
  }

  next.focus();
  next.scrollIntoView({ block: "center", behavior: "smooth" });
}

export function onEnterGoToNextField(
  event: React.KeyboardEvent<HTMLInputElement>,
) {
  if (event.key !== "Enter") return;
  event.preventDefault();
  focusNextField(event.currentTarget);
}
