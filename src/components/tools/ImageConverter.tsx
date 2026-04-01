'use client';

import { useState } from 'react';
import ToolLayout from '@/components/tools/ToolLayout';
import JSZip from 'jszip';

type Img = {
  file: File;
  preview: string;
  output?: string;
};

export default function ImageConverter() {
  const [images, setImages] = useState<Img[]>([]);
  const [mode, setMode] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const [quality, setQuality] = useState(0.85);
  const [resize, setResize] = useState(false);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleFiles = (files: FileList) => {
    const arr: Img[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(arr);
  };

  const processImages = async () => {
    setProcessing(true);
    const updated = [...images];

    for (let i = 0; i < updated.length; i++) {
      const imgObj = updated[i];

      await new Promise<void>((resolve) => {
        const img = new Image();
        img.src = imgObj.preview;

        img.onload = () => {
          const canvas = document.createElement('canvas');

          const w = resize && width ? parseInt(width) : img.width;
          const h = resize && height ? parseInt(height) : img.height;

          canvas.width = w;
          canvas.height = h;

          const ctx = canvas.getContext('2d');
          ctx!.drawImage(img, 0, 0, w, h);

          const mime = `image/${mode}`;

          const output =
            mode === 'png'
              ? canvas.toDataURL(mime)
              : canvas.toDataURL(mime, quality);

          updated[i].output = output;
          resolve();
        };
      });
    }

    setImages(updated);
    setProcessing(false);
  };

  const downloadAll = async () => {
    const zip = new JSZip();

    images.forEach((img, i) => {
      if (img.output) {
        const base64 = img.output.split(',')[1];
        zip.file(`image-${i}.${mode}`, base64, { base64: true });
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'converted-images.zip';
    link.click();
  };

  return (
    <ToolLayout
      title="Image Converter"
      description="Convert, resize & compress images instantly"
      toolName="Image Converter"
    >
      <div className="space-y-10">

        {/* MODE SELECT */}
        <div className="flex justify-center gap-4">
          {['jpeg', 'png', 'webp'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as any)}
              className={`px-6 py-3 rounded-xl font-semibold ${
                mode === m
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border'
              }`}
            >
              Convert to {m.toUpperCase()}
            </button>
          ))}
        </div>

        {/* UPLOAD */}
        <div
          className="border-2 border-dashed rounded-3xl p-16 text-center bg-white shadow"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
        >
          <p className="text-2xl font-bold">Upload or Drop Images</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFiles(e.target.files!)}
            className="mt-5"
          />
        </div>

        {/* SETTINGS CARD */}
        <div className="bg-white p-6 rounded-2xl shadow space-y-6">

          {/* COMPRESSION */}
          <div>
            <label className="font-semibold">
              Compression Quality ({Math.round(quality * 100)}%)
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* RESIZE */}
          <div>
            <label className="font-semibold flex gap-3 items-center">
              <input
                type="checkbox"
                checked={resize}
                onChange={() => setResize(!resize)}
              />
              Resize Image
            </label>

            {resize && (
              <div className="grid md:grid-cols-2 gap-4 mt-3">
                <input
                  placeholder="Width (px)"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="border p-3 rounded-xl"
                />
                <input
                  placeholder="Height (px)"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="border p-3 rounded-xl"
                />
              </div>
            )}
          </div>

        </div>

        {/* PROCESS */}
        <button
          onClick={processImages}
          disabled={processing || images.length === 0}
          className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg"
        >
          {processing ? 'Processing...' : 'Convert Images'}
        </button>

        {/* PREVIEW */}
        {images.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {images.map((img, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl shadow">
                <img src={img.output || img.preview} className="rounded-xl" />

                {img.output && (
                  <a
                    href={img.output}
                    download={`image-${i}.${mode}`}
                    className="block mt-3 bg-green-600 text-white text-center py-2 rounded-lg"
                  >
                    Download
                  </a>
                )}
              </div>
            ))}
          </div>
        )}

        {images.some((i) => i.output) && (
          <button
            onClick={downloadAll}
            className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold"
          >
            Download All ZIP
          </button>
        )}
      </div>
    </ToolLayout>
  );
}