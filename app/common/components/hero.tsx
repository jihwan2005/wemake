interface HeroProps {
  title: string;
  subtitle?: React.ReactNode;
}

export function Hero({ title, subtitle }: HeroProps) {
  return (
    <div className="flex flex-col justify-center items-center rounded-md bg-gradient-to-t from-background to-primary/10 py-20">
      <h1 className="text-5xl font-bold italic">{title}</h1>
      <div className="text-2xl font-light text-foreground text-center space-y-2">
        {subtitle}
      </div>
    </div>
  );
}
