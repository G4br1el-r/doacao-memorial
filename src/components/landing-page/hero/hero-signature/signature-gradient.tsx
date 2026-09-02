interface SignatureGradientProps {
  id: string;
}

export function SignatureGradient({ id }: SignatureGradientProps) {
  return (
    <linearGradient
      id={id}
      x1="0"
      y1="0"
      x2="0"
      y2="724"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stopColor="#F7D79A" />
      <stop offset="0.48" stopColor="#DDB46A" />
      <stop offset="1" stopColor="#B97D31" />
    </linearGradient>
  );
}
