import { Info } from "lucide-react";
import type { FeeStructure } from "@/lib/types/school";
import { formatKsh } from "@/lib/utils";
import { Reveal } from "@/components/shared/motion";

const FEE_ROWS: Array<{ key: keyof FeeStructure; label: string; hint?: string }> = [
  { key: "tuition", label: "Tuition" },
  { key: "administrativeFee", label: "Administrative Fee" },
  { key: "activityFee", label: "Activity Fee" },
  { key: "transportFee", label: "Transport Fee" },
  { key: "otherFees", label: "Other Fees" },
];

function termLabel(term: number) {
  const names = ["", "Term 1", "Term 2", "Term 3"];
  return names[term] ?? `Term ${term}`;
}

function groupFees(fees: FeeStructure[]): FeeStructure[][] {
  const groups = new Map<string, FeeStructure[]>();
  for (const fee of fees) {
    const key = `${fee.academicYear}-${fee.term}`;
    const list = groups.get(key) ?? [];
    list.push(fee);
    groups.set(key, list);
  }
  return [...groups.values()];
}

export function FeesTable({ fees }: { fees: FeeStructure[] }) {
  if (fees.length === 0) {
    return (
      <p className="rounded-2xl border border-royal-100 bg-white p-8 text-center text-sm text-royal-900/60">
        No fee information has been published yet.
      </p>
    );
  }

  const groups = groupFees(fees).sort((a, b) => {
    const byYear = b[0].academicYear - a[0].academicYear;
    return byYear || a[0].term - b[0].term;
  });

  const allZero = fees.every(
    (fee) =>
      fee.tuition === 0 &&
      fee.administrativeFee === 0 &&
      fee.activityFee === 0 &&
      fee.transportFee === 0 &&
      fee.otherFees === 0,
  );

  return (
    <div className="space-y-12">
      {allZero ? (
        <p className="flex items-start gap-3 rounded-2xl border border-sunflower-200 bg-sunflower-50 p-5 text-sm text-sunflower-900">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-sunflower-600" aria-hidden="true" />
          <span>
            The official fee structure will be published here by the school administration shortly.
            Fees are subject to confirmation by the school administration.
          </span>
        </p>
      ) : null}

      {groups.map((group) => {
        const year = group[0].academicYear;
        const term = group[0].term;
        const sorted = [...group].sort(
          (a, b) => a.displayOrder - b.displayOrder || a.className.localeCompare(b.className),
        );

        return (
          <Reveal key={`${year}-${term}`}>
            <div className="overflow-hidden rounded-3xl border border-royal-100 bg-white shadow-sm">
              <div className="flex flex-col gap-1 bg-royal-800 px-6 py-5 text-white sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-display text-lg font-bold">
                  {termLabel(term)} · {year} Academic Year
                </h3>
                <p className="text-xs font-semibold uppercase tracking-widest text-sunflower-400">
                  Per-Term Fees
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-royal-100 bg-royal-50/60">
                      <th scope="col" className="px-6 py-3.5 font-bold text-royal-950">
                        Fee
                      </th>
                      {sorted.map((fee) => (
                        <th key={fee.id} scope="col" className="px-4 py-3.5 font-bold text-royal-950">
                          {fee.className}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FEE_ROWS.map((row) => (
                      <tr key={row.key} className="border-b border-royal-100/70 last:border-0">
                        <th scope="row" className="px-6 py-4 font-semibold text-royal-900/80">
                          {row.label}
                          {row.hint ? (
                            <span className="block text-xs font-normal text-royal-900/40">
                              {row.hint}
                            </span>
                          ) : null}
                        </th>
                        {sorted.map((fee) => (
                          <td key={fee.id} className="px-4 py-4 text-royal-900/80">
                            {formatKsh(Number(fee[row.key]) || 0)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className="bg-mint-50/60">
                      <th scope="row" className="px-6 py-4 font-bold text-mint-800">
                        Per-Term Total
                      </th>
                      {sorted.map((fee) => {
                        const total =
                          Number(fee.tuition) +
                          Number(fee.administrativeFee) +
                          Number(fee.activityFee) +
                          Number(fee.transportFee) +
                          Number(fee.otherFees);
                        return (
                          <td key={fee.id} className="px-4 py-4 font-bold text-mint-800">
                            {formatKsh(total)}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
              {sorted.some((fee) => fee.notes) ? (
                <div className="space-y-1.5 border-t border-royal-100 px-6 py-4">
                  {sorted
                    .filter((fee) => fee.notes)
                    .map((fee) => (
                      <p key={fee.id} className="text-xs text-royal-900/55">
                        <span className="font-semibold text-royal-900/75">{fee.className}:</span>{" "}
                        {fee.notes}
                      </p>
                    ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        );
      })}

      <p className="text-center text-sm text-royal-900/50">
        Fees are subject to confirmation by the school administration.{" "}
        <a
          href="/admissions"
          className="font-semibold text-royal-800 underline underline-offset-4 hover:text-royal-700"
        >
          Contact us
        </a>{" "}
        for the most current information.
      </p>
    </div>
  );
}