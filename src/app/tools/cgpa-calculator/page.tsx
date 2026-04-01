import type { Metadata } from 'next';
import CGPACalculator from '@/components/tools/CGPACalculator';

export const metadata: Metadata = {
  title: 'CGPA Calculator - StudentTools',
  description:
    'Calculate your CGPA & SGPA instantly using Indian grading system. Understand grading schemes, formulas, and academic performance easily.',
};

export default function CGPAPage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen">

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          CGPA Calculator
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Calculate your academic performance using the Indian 10-point grading
          system. Understand SGPA, CGPA formulas and grading scheme in a simple
          and professional way.
        </p>
      </section>

      {/* FORMULA SECTION */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-8 mb-14">

        {/* CGPA FORMULA */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">
            CGPA Formula
          </h2>
          <p className="text-gray-700 mb-4">
            CGPA (Cumulative Grade Point Average) is calculated by taking the
            weighted average of grade points across all semesters.
          </p>

          <div className="bg-blue-50 p-4 rounded-lg text-lg font-semibold text-center">
            CGPA = Σ (Grade Point × Credits) / Σ Credits
          </div>
        </div>

        {/* SGPA FORMULA */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border">
          <h2 className="text-2xl font-bold mb-4 text-indigo-700">
            SGPA Formula
          </h2>
          <p className="text-gray-700 mb-4">
            SGPA (Semester Grade Point Average) represents performance in a
            single semester.
          </p>

          <div className="bg-indigo-50 p-4 rounded-lg text-lg font-semibold text-center">
            SGPA = Σ (Subject Grade Point × Subject Credits) / Total Semester Credits
          </div>
        </div>
      </section>

      {/* GRADING TABLE */}
      <section className="max-w-5xl mx-auto px-6 mb-14">
        <div className="bg-white rounded-2xl shadow-lg p-8 border">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
            Indian Grading Scheme (10 Point)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { grade: 'O', point: 10 },
              { grade: 'A+', point: 9 },
              { grade: 'A', point: 8 },
              { grade: 'B+', point: 7 },
              { grade: 'B', point: 6 },
              { grade: 'C', point: 5 },
              { grade: 'D', point: 4 },
              { grade: 'F', point: 0 },
            ].map((g) => (
              <div
                key={g.grade}
                className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md"
              >
                <p className="text-2xl font-bold">{g.grade}</p>
                <p className="text-sm opacity-90">Grade Point {g.point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW TO CALCULATE */}
      <section className="max-w-6xl mx-auto px-6 mb-14 grid md:grid-cols-2 gap-8">

        <div className="bg-white p-8 rounded-2xl shadow-lg border">
          <h3 className="text-2xl font-bold mb-4 text-green-700">
            How to Calculate SGPA
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>• Multiply grade point with subject credits</li>
            <li>• Add all subject results</li>
            <li>• Divide by total semester credits</li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border">
          <h3 className="text-2xl font-bold mb-4 text-purple-700">
            How to Calculate CGPA
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>• Calculate SGPA of each semester</li>
            <li>• Multiply SGPA with semester credits</li>
            <li>• Divide total by overall credits</li>
          </ul>
        </div>

      </section>

      {/* CALCULATOR */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <CGPACalculator />
      </section>

    </div>
  );
}