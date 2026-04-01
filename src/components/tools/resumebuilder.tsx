'use client';

import { useState } from 'react';
import ResumeTemplateSelector from './ResumeTemplateSelector';

export default function ResumeBuilder() {
  const [step, setStep] = useState(1);
  const [template, setTemplate] = useState('');

  const [data, setData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    summary: '',
    skills: '',
    experience: '',
    education: '',
  });

  const update = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  if (step === 1) {
    return (
      <ResumeTemplateSelector
        onSelect={(t: string) => {
          setTemplate(t);
          setStep(2);
        }}
      />
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10">

        <div className="bg-white p-8 rounded-3xl shadow-xl space-y-4">
          <h2 className="text-2xl font-bold">Enter Resume Details</h2>

          <input className="input" placeholder="Name" onChange={e=>update('name', e.target.value)} />
          <input className="input" placeholder="Role" onChange={e=>update('role', e.target.value)} />
          <input className="input" placeholder="Email" onChange={e=>update('email', e.target.value)} />
          <input className="input" placeholder="Phone" onChange={e=>update('phone', e.target.value)} />
          <textarea className="input" placeholder="Summary" onChange={e=>update('summary', e.target.value)} />
          <textarea className="input" placeholder="Skills" onChange={e=>update('skills', e.target.value)} />
          <textarea className="input" placeholder="Experience" onChange={e=>update('experience', e.target.value)} />
          <textarea className="input" placeholder="Education" onChange={e=>update('education', e.target.value)} />

          <button
            onClick={()=>setStep(3)}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
          >
            Preview Resume
          </button>

        </div>

        <div className="bg-gray-100 p-6 rounded-3xl shadow-inner">
          <h1 className="text-4xl font-bold">{data.name}</h1>
          <p className="text-blue-600">{data.role}</p>

          <p className="mt-2">{data.email} | {data.phone}</p>

          <h3 className="font-bold mt-4">Summary</h3>
          <p>{data.summary}</p>

          <h3 className="font-bold mt-4">Skills</h3>
          <p>{data.skills}</p>

          <h3 className="font-bold mt-4">Experience</h3>
          <p>{data.experience}</p>

          <h3 className="font-bold mt-4">Education</h3>
          <p>{data.education}</p>
        </div>

      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-10 rounded-3xl shadow">
      <h2 className="text-3xl font-bold mb-4">Final Resume Preview</h2>

      <h1 className="text-5xl font-bold">{data.name}</h1>
      <p className="text-blue-600">{data.role}</p>

      <p className="mt-2">{data.email} | {data.phone}</p>

      <p className="mt-4">{data.summary}</p>
      <p className="mt-4">{data.skills}</p>
      <p className="mt-4">{data.experience}</p>
      <p className="mt-4">{data.education}</p>

      <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-xl">
        Download PDF (next step)
      </button>
    </div>
  );
}