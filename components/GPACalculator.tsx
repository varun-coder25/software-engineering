"use client";

import { Calculator, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

const createInitialSubjects = (): Subject[] =>
  Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    name: "",
    credits: "",
    grade: ""
  }));

export default function GPACalculator({
  onValueChange
}: {
  onValueChange?: (value: number) => void;
}) {
  const [subjects, setSubjects] = useState(createInitialSubjects);

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
    setSubjects(createInitialSubjects());
  };

  useEffect(() => {
    onValueChange?.(Number(gpa));
  }, [gpa, onValueChange]);

  return (
    <section className="space-y-6" id="gpa">
      <Card className="min-w-0">
        <CardHeader className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <Badge variant="default">GPA Calculator</Badge>
            <CardTitle className="text-2xl sm:text-3xl">VIT grading system, up to six subjects</CardTitle>
            <p className="max-w-2xl text-sm leading-7 text-slate-400">
              Enter subject name, credits, and the VIT letter grade to compute
              GPA automatically using weighted grade points.
            </p>
          </div>

          <div className="surface-panel rounded-[1.75rem] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Calculated GPA</p>
            <p className="mt-2 text-4xl font-semibold text-white">{gpa}</p>
            <p className="mt-1 text-sm text-slate-400">
              {totalCredits} credits across {completedSubjects} active subjects
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-800">
            <div className="grid grid-cols-[1.3fr_0.5fr_0.7fr] gap-3 border-b border-slate-800 bg-slate-900/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              <span>Subject</span>
              <span>Credits</span>
              <span>Grade</span>
            </div>

            <div className="divide-y divide-slate-900">
              {subjects.map((subject, index) => (
                <div
                  className="grid grid-cols-1 gap-3 bg-slate-950/30 px-4 py-4 sm:grid-cols-[1.3fr_0.5fr_0.7fr]"
                  key={subject.id}
                >
                  <Input
                    placeholder={`Subject ${index + 1}`}
                    type="text"
                    value={subject.name}
                    onChange={(event) => updateSubject(subject.id, "name", event.target.value)}
                  />
                  <Input
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

          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="surface-panel rounded-2xl px-5 py-4 text-sm text-slate-400">
              Grade scale: S=10, A=9, B=8, C=7, D=6, E=5, F=0
            </div>

            <Button variant="outline" onClick={resetSubjects}>
              <RotateCcw className="h-4 w-4" />
              Reset subjects
            </Button>
          </div>

          {validationError ? (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              {validationError}
            </div>
          ) : (
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                GPA updates automatically as you edit each row.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
