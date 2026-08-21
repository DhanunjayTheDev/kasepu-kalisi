import { cn } from "@/lib/utils";

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  const progress = ((current + 1) / steps.length) * 100;

  return (
    <div>
      {/* Phones get a compact "Step n of m" bar — seven labelled pills wrap into a mess. */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-xl text-teal">{steps[current]}</p>
          <p className="font-sans text-xs font-medium text-slate">
            Step {current + 1} of {steps.length}
          </p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate/15">
          <div
            className="h-full rounded-full bg-terracotta transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ol className="hidden flex-wrap items-center gap-x-6 gap-y-3 sm:flex">
        {steps.map((label, index) => {
          const state = index < current ? "done" : index === current ? "active" : "upcoming";
          return (
            <li key={label} className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full font-sans text-xs font-semibold",
                  state === "done" && "bg-teal text-ivory",
                  state === "active" && "bg-terracotta text-ivory",
                  state === "upcoming" && "bg-slate/10 text-slate"
                )}
              >
                {index + 1}
              </span>
              <span className={cn("font-sans text-sm font-medium", state === "upcoming" ? "text-slate" : "text-teal")}>
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
