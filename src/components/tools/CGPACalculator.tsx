'use client';

import { useState } from 'react';
import ToolLayout from '@/components/tools/ToolLayout';

export default function CGPACalculator() {
  const [subjects, setSubjects] = useState<
    Array<{ name: string; grade: string; credits: number }>
  >([{ name: '', grade: 'O', credits: 3 }]);

  const [cgpa, setCgpa] = useState<number | null>(null);
  const [sgpa, setSgpa] = useState<number | null>(null);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [currentSemester, setCurrentSemester] = useState(1);

  const gradePoints: Record<string, number> = {
    O: 10,
    'A+': 9,
    A: 8,
    'B+': 7,
    B: 6,
    C: 5,
    D: 4,
    F: 0,
  };

  const addSubject = () => {
    setSubjects([...subjects, { name: '', grade: 'O', credits: 3 }]);
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const updateSubject = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalPoints = 0;

    subjects.forEach((subject) => {
      const gradePoint = gradePoints[subject.grade] || 0;
      totalPoints += gradePoint * subject.credits;
      totalCredits += subject.credits;
    });

    const semesterSGPA = totalCredits > 0 ? totalPoints / totalCredits : 0;

    const newSemester = {
      sem: currentSemester,
      sgpa: semesterSGPA,
      credits: totalCredits,
      points: totalPoints,
    };

    const updatedSemesters = [...semesters, newSemester];

    setSemesters(updatedSemesters);
    setSgpa(parseFloat(semesterSGPA.toFixed(2)));

    let cgpaCredits = 0;
    let cgpaPoints = 0;

    updatedSemesters.forEach((sem) => {
      cgpaCredits += sem.credits;
      cgpaPoints += sem.points;
    });

    const finalCGPA = cgpaPoints / cgpaCredits;
    setCgpa(parseFloat(finalCGPA.toFixed(2)));

    setCurrentSemester(currentSemester + 1);
    setSubjects([{ name: '', grade: 'O', credits: 3 }]);

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        toolName: 'CGPA Calculator',
        toolType: 'Calculator',
        input: { semesters: updatedSemesters },
        result: { cgpa: finalCGPA },
      }),
    }).catch(console.error);
  };

  return (
    <ToolLayout
      title={`CGPA & SGPA Calculator (Semester ${currentSemester})`}
      description="Professional Indian Academic Grade Calculator"
      toolName="CGPA Calculator"
    >
      <div className="space-y-10">

        <div className="bg-white shadow-xl rounded-2xl p-6 border">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Enter Subject Details
          </h2>

          <div className="space-y-4">
            {subjects.map((subject, index) => (
              <div key={index} className="grid md:grid-cols-4 gap-4 items-end">
                <input
                  type="text"
                  placeholder="Subject Name"
                  value={subject.name}
                  onChange={(e) =>
                    updateSubject(index, 'name', e.target.value)
                  }
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <select
                  value={subject.grade}
                  onChange={(e) =>
                    updateSubject(index, 'grade', e.target.value)
                  }
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {Object.keys(gradePoints).map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Credits"
                  value={subject.credits}
                  onChange={(e) =>
                    updateSubject(
                      index,
                      'credits',
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <button
                  onClick={() => removeSubject(index)}
                  className="bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addSubject}
            className="mt-6 w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
          >
            Add Subject
          </button>
        </div>

        <button
          onClick={calculateCGPA}
          className="w-full py-4 bg-blue-700 text-white rounded-2xl text-lg font-bold shadow-lg hover:bg-blue-800 transition"
        >
          Calculate Semester Result
        </button>

        {(cgpa !== null || sgpa !== null) && (
          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-10 rounded-2xl shadow-2xl text-center">
              <p className="text-lg opacity-90">Semester {currentSemester - 1}</p>
              <p className="text-6xl font-extrabold mt-2">{sgpa}</p>
              <p className="opacity-80 mt-2">SGPA</p>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-10 rounded-2xl shadow-2xl text-center">
              <p className="text-lg opacity-90">Overall</p>
              <p className="text-6xl font-extrabold mt-2">{cgpa}</p>
              <p className="opacity-80 mt-2">CGPA</p>
            </div>

          </div>
        )}

      </div>
    </ToolLayout>
  );
}