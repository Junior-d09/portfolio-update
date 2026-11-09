import { cn } from "@/lib/cn";

export const inputCls =
  "w-full rounded-xl bg-ink px-4 py-3 text-base text-text ring-1 ring-line outline-none transition placeholder:text-[#8A82A3] focus:ring-2 focus:ring-violet aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-orange [&:not(textarea)]:h-[52px]";

interface FieldProps {
  id: string;
  label: string;
  optional?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

/** Libellé + champ + message d'erreur relié par aria-describedby. */
export function Field({ id, label, optional, error, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-center gap-2 text-sm font-semibold">
        {label}
        {optional && <span className="font-normal text-muted">{optional}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-orange-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/** Champ piège : invisible pour un humain, rempli par les robots. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function SubmitButton({ children, pending, disabled, className }: { children: React.ReactNode; pending: boolean; disabled?: boolean; className?: string }) {
  return (
    <button
      type="submit"
      disabled={pending || disabled}
      aria-busy={pending}
      className={cn(
        "inline-flex h-12 items-center justify-center gap-2 rounded-full bg-violet px-6 text-base font-semibold text-white transition-all hover:brightness-110 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
