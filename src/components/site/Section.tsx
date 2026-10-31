import { cn } from "@/lib/cn";

/** Conteneur de section : largeur max et marges cohérentes sur tout le site. */
export function Section({
  children,
  className,
  panel = false,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  panel?: boolean;
  id?: string;
}) {
  return (
    <section id={id} className={cn(panel && "bg-panel")}>
      <div className={cn("mx-auto max-w-7xl px-5 md:px-12", className)}>{children}</div>
    </section>
  );
}
