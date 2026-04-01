'use client';

const templates = [
  { id: 'modern', name: 'Modern Professional', color: 'bg-blue-100' },
  { id: 'minimal', name: 'Minimal Clean', color: 'bg-gray-100' },
  { id: 'corporate', name: 'Corporate ATS', color: 'bg-green-100' },
  { id: 'creative', name: 'Creative Designer', color: 'bg-pink-100' },
  { id: 'executive', name: 'Executive Senior', color: 'bg-yellow-100' },
];

export default function ResumeTemplateSelector({ onSelect }: any) {
  return (
    <div className="max-w-6xl mx-auto py-10">

      <h2 className="text-4xl font-bold text-center mb-12">
        Choose a Resume Template
      </h2>

      <div className="grid md:grid-cols-3 gap-8">
        {templates.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition cursor-pointer p-6"
            onClick={() => onSelect(t.id)}
          >
            <div className={`h-60 rounded-lg mb-4 ${t.color}`} />

            <h3 className="text-xl font-bold">{t.name}</h3>

            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl">
              Use Template
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}