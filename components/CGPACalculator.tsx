"use client";

import { GraduationCap, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const createInitialSemesters = () =>
  Array.from({ length: 8 }, (_, index) => ({
    id: index + 1,
    value: ""
  }));

export default function CGPACalculator({
  onValueChange
}: {
  onValueChange?: (value: number) => void;
}) {
  const [semesters, setSemesters] = useState(createInitialSemesters);

  const { cgpa, enteredSemesters, validationError } = useMemo(() => {
    const activeValues = semesters
      .map((semester) => semester.value.trim())
      .filter((value) => value !== "");

    const invalidValue = activeValues.find((value) => {
      const numericValue = Number(value);
      return !Number.isFinite(numericValue) || numericValue < 0 || numericValue > 10;
    });

    if (invalidValue) {
      return {
        cgpa: "0.00",
        enteredSemesters: activeValues.length,
        validationError: "Each semester GPA must be between 0 and 10."
      };
    }

    const total = activeValues.reduce((sum, value) => sum + Number(value), 0);

    return {
      cgpa: activeValues.length ? (total / activeValues.length).toFixed(2) : "0.00",
      enteredSemesters: activeValues.length,
      validationError: ""
    };
  }, [semesters]);

  const updateSemester = (id: number, value: string) => {
    setSemesters((currentSemesters) =>
      currentSemesters.map((semester) =>
        semester.id === id ? { ...semester, value } : semester
      )
    );
  };

  const resetSemesters = () => {
    setSemesters(createInitialSemesters());
  };

  useEffect(() => {
    onValueChange?.(Number(cgpa));
  }, [cgpa, onValueChange]);

  return (
    <section className="space-y-6" id="cgpa">
      <Card className="min-w-0">
        <CardHeader className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <Badge variant="secondary">CGPA Calculator</Badge>
            <CardTitle className="text-2xl sm:text-3xl">Aggregate up to eight semesters</CardTitle>
            <p className="max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-400">
              Enter semester GPA values from 0 to 10 and compute the cumulative
              average instantly.
            </p>
          </div>

          <div className="surface-panel rounded-[1.75rem] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Calculated CGPA</p>
            <p className="mt-2 text-4xl font-semibold text-slate-950 dark:text-white">{cgpa}</p>
            <p className="mt-1 text-sm text-slate-500">
              Based on {enteredSemesters} semester{enteredSemesters === 1 ? "" : "s"}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {semesters.map((semester) => (
              <div className="surface-panel min-w-0 rounded-[1.5rem] p-4 transition-transform duration-300 hover:-translate-y-1" key={semester.id}>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-indigo-500" />
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Semester {semester.id}
                  </span>
                </div>
                <Input
                  className="mt-4"
                  inputMode="decimal"
                  max="10"
                  min="0"
                  placeholder="0.00 - 10.00"
                  step="0.01"
                  type="number"
                  value={semester.value}
                  onChange={(event) => updateSemester(semester.id, event.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={resetSemesters}>
              <RotateCcw className="h-4 w-4" />
              Reset semesters
            </Button>
          </div>

          {validationError ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
              {validationError}
            </div>
          ) : (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-300">
              CGPA rounds to two decimal places and updates live as you type.
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
