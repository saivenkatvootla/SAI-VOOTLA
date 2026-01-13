
import React, { useState } from 'react';
import { scanMedicineLabel } from '../services/geminiService';
import { MedicineInfo } from '../types';

interface MedicineScannerProps {
  onResult: (info: MedicineInfo) => void;
}

export const MedicineScanner: React.FC<MedicineScannerProps> = ({ onResult }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        try {
          const result = await scanMedicineLabel(base64);
          onResult(result);
        } catch (err) {
          setError("Failed to analyze the image. Please ensure the label is clear.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("An error occurred while reading the file.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-800">Scan Medicine Label</h2>
        <p className="text-slate-500 mt-2">Upload a photo of your prescription or medicine bottle.</p>
      </div>

      <div className="w-full max-w-xs p-8 border-2 border-dashed border-teal-200 rounded-3xl bg-teal-50 flex flex-col items-center justify-center relative overflow-hidden group">
        {loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
            <p className="mt-4 text-teal-700 font-medium">Analyzing Label...</p>
          </div>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <label className="cursor-pointer bg-teal-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:bg-teal-700 transition-all">
              Choose Photo
              <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileUpload} />
            </label>
          </>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-center gap-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          {error}
        </div>
      )}

      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
        <h3 className="text-amber-800 font-semibold text-sm flex items-center gap-2">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM5.884 6.606a1 1 0 10-1.415-1.414l.707-.707a1 1 0 001.414 1.414l-.707.707zm11.314 2.122a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM5 10a1 1 0 01-1 1H4a1 1 0 110-2h1a1 1 0 011 1zM10 11a1 1 0 01-1-1V9a1 1 0 112 0v1a1 1 0 01-1 1zM14.5 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zM5.99 14.24a1 1 0 00-1.41 1.41l.71.71a1 1 0 001.41-1.41l-.71-.71zM14.25 15.66a1 1 0 001.41-1.41l-.71-.71a1 1 0 00-1.41 1.41l.71.71z" clipRule="evenodd" /></svg>
          Tips for best results:
        </h3>
        <ul className="text-xs text-amber-700 mt-1 space-y-1 list-disc list-inside">
          <li>Ensure good lighting</li>
          <li>Hold the label flat and steady</li>
          <li>Focus on the medicine name and dosage</li>
        </ul>
      </div>
    </div>
  );
};
