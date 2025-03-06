interface HeroProps {
  title: string;
}

export function Hero({ title }: HeroProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">{title}</h1>
    </div>
  );
}
