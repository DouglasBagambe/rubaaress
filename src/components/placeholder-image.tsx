type PlaceholderImageProps = {
  label: string;
  aspect?: "wide" | "portrait" | "square";
  priority?: boolean;
};

const aspectClass: Record<NonNullable<PlaceholderImageProps["aspect"]>, string> = {
  wide: "aspect-[16/10]",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
};

export function PlaceholderImage({
  label,
  aspect = "wide",
}: PlaceholderImageProps) {
  return (
    <div
      className={`${aspectClass[aspect]} flex min-h-56 w-full items-center justify-center border border-stone-300 bg-stone-100 p-6 text-center text-sm font-semibold uppercase tracking-[0.16em] text-stone-700`}
      role="img"
      aria-label={label}
    >
      {label}
    </div>
  );
}
