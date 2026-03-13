"use client";

import { useMemo, useState } from "react";

const grades = [
  { label: "S", points: 10 },
  { label: "A", points: 9 },
  { label: "B", points: 8 },
  { label: "C", points: 7 },
  { label: "D", points: 6 },
  { label: "E", points: 5 },
  { label: "F", points: 0 }
] as const;

type Subject = {
  id: number;
  name: string;
  credits: string;
  grade: string;
};

const initialSubjects: Subject[] = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  name: "",
  credits: "",
  grade: ""
}));

export default function GPACalculator() {
  const [subjects, setSubjects] = useState(initialSubjects);

  const { gpa, totalCredits, validationError, completedSubjects } = useMemo(() => {
    let earnedPoints = 0;
    let creditsSum = 0;
    let error = "";
    let filledCount = 0;

    subjects.forEach((subject) => {
      const hasAnyValue = subject.name || subject.credits || subject.grade;
      if (!hasAnyValue) {
        return;
      }

      filledCount += 1;

      const numericCredits = Number(subject.credits);
      const matchedGrade = grades.find((grade) => grade.label === subject.grade);

      if (!subject.name.trim() || !subject.grade || !subject.credits) {
        error = "Complete the subject name, credits, and grade for every active subject row.";
        return;
      }

      if (!Number.isFinite(numericCredits) || numericCredits <= 0) {
        error = "Credits must be a positive number for each subject.";
        return;
      }

      if (!matchedGrade) {
        error = "Select a valid grade for every subject.";
        return;
      }

      creditsSum += numericCredits;
      earnedPoints += matchedGrade.points * numericCredits;
    });

    return {
      gpa: creditsSum > 0 && !error ? (earnedPoints / creditsSum).toFixed(2) : "0.00",
      totalCredits: creditsSum,
      validationError: error,
      completedSubjects: filledCount
    };
  }, [subjects]);

  const updateSubject = (id: number, field: keyof Subject, value: string) => {
    setSubjects((currentSubjects) =>
      currentSubjects.map((subject) =>
        subject.id === id ? { ...subject, [field]: value } : subject
      )
    );
  };

  const resetSubjects = () => {
    setSubjects(initialSubjects);
  };

  return (
    <section className="glass-panel p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            Module 2
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">
            GPA Calculator
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Calculate VIT-standard GPA across up to six subjects using credits
            and grade points.
          </p>
        </div>

        <div className="rounded-[1.5rem] border border-blue-100 bg-blue-50 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-blue-700">Calculated GPA</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{gpa}</p>
          <p className="mt-1 text-sm text-slate-600">
            {totalCredits} total credits across {completedSubjects} active subjects
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
        <div className="grid grid-cols-[1.3fr_0.5fr_0.7fr] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          <span>Subject</span>
          <span>Credits</span>
          <span>Grade</span>
        </div>

        <div className="divide-y divide-slate-100">
          {subjects.map((subject, index) => (
            <div className="grid grid-cols-1 gap-3 px-4 py-4 sm:grid-cols-[1.3fr_0.5fr_0.7fr]" key={subject.id}>
              <input
                className="field"
                placeholder={`Subject ${index + 1}`}
                type="text"
                value={subject.name}
                onChange={(event) => updateSubject(subject.id, "name", event.target.value)}
              />
              <input
                className="field"
                inputMode="decimal"
                min="0"
                placeholder="Credits"
                type="number"
                value={subject.credits}
                onChange={(event) => updateSubject(subject.id, "credits", event.target.value)}
              />
              <select
                className="field"
                value={subject.grade}
                onChange={(event) => updateSubject(subject.id, "grade", event.target.value)}
              >
                <option value="">Select grade</option>
                {grades.map((grade) => (
                  <option key={grade.label} value={grade.label}>
                    {grade.label} ({grade.points})
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
          Grade scale: S=10, A=9, B=8, C=7, D=6, E=5, F=0
        </div>
        <button className="button-secondary" onClick={resetSubjects} type="button">
          Reset subjects
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
