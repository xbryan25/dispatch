import { cn } from '@/lib/utils';

export function Initial({
  letter,
  className,
  style,
}: {
  letter: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      style={style}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold',
        className
      )}
    >
      {letter}
    </span>
  );
}
