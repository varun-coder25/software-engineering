"use client";

import { useMemo, useState } from "react";

const initialSemesters = Array.from({ length: 8 }, (_, index) => ({
  id: index + 1,
  value: ""
}));

export default function CGPACalculator() {
  const [semesters, setSemesters] = useState(initialSemesters);

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
    setSemesters(initialSemesters);
  };

  return (
    <section className="glass-panel p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            CGPA Summary
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            CGPA Calculator
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Average semester GPAs across up to eight semesters to estimate your
            cumulative performance.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-indigo-100 bg-indigo-50 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-indigo-700">Calculated CGPA</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{cgpa}</p>
          <p className="mt-1 text-sm text-slate-600">
            Based on {enteredSemesters} semester{enteredSemesters === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {semesters.map((semester) => (
          <label
            className="rounded-[1.5rem] border border-slate-200 bg-white p-4"
            key={semester.id}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Semester {semester.id}
            </span>
            <input
              className="field mt-3"
              inputMode="decimal"
              max="10"
              min="0"
              placeholder="0.00 - 10.00"
              step="0.01"
              type="number"
              value={semester.value}
              onChange={(event) => updateSemester(semester.id, event.target.value)}
            />
          </label>
        ))}
      </div>

      <div className="mt-5 flex justify-end">
        <button className="button-secondary" onClick={resetSemesters} type="button">
          Reset semesters
        </button>
      </div>

      {validationError ? (
        <p className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          {validationError}
        </p>
      ) : null}
    </section>
  );
}
