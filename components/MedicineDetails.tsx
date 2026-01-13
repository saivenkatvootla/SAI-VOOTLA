
import React, { useState } from 'react';
import { MedicineInfo, LANGUAGES, Reminder } from '../types';
import { translateMedicineInfo } from '../services/geminiService';

interface MedicineDetailsProps {
  info: MedicineInfo;
  onAddReminder: (reminder: Omit<Reminder, 'id'>) => void;
}

export const MedicineDetails: React.FC<MedicineDetailsProps> = ({ info, onAddReminder }) => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');

  const handleTranslate = async (langCode: string) => {
    if (langCode === 'en') {
      setTranslatedText(null);
      setSelectedLang('en');
      return;
    }
    setTranslating(true);
    setSelectedLang(langCode);
    try {
      const langName = LANGUAGES.find(l => l.code === langCode)?.name || 'target language';
      const result = await translateMedicineInfo(info, langName);
      setTranslatedText(result);
    } catch (err) {
      alert("Translation failed.");
    } finally {
      setTranslating(false);
    }
  };

  const handleQuickAddReminder = () => {
    const timeMatches = info.dosageInstructions.match(/\b([01]?[0-9]|2[0-3]):[0-5][0-9]\b/);
    const defaultTime = timeMatches ? timeMatches[0] : '09:00';
    
    onAddReminder({
      medicineName: info.name,
      time: defaultTime,
      dosage: info.dosageInstructions.split('.')[0] || '1 tablet',
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-2 py-1 rounded-full border border-teal-100">FDA Database Source</span>
            <h2 className="text-2xl font-bold text-slate-800 mt-2">{info.name}</h2>
            <p className="text-slate-500 font-medium">{info.brandName === info.name ? 'Generic Available' : `Brand: ${info.brandName}`}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <select 
              value={selectedLang}
              onChange={(e) => handleTranslate(e.target.value)}
              className="text-xs font-semibold border border-slate-200 rounded-full px-3 py-1.5 bg-slate-50 text-slate-600 outline-none focus:ring-2 focus:ring-teal-500 transition-all cursor-pointer"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>{lang.name}</option>
              ))}
            </select>
          </div>
        </div>

        {translating ? (
          <div className="flex flex-col items-center gap-2 py-12 justify-center text-teal-600 italic">
            <div className="animate-spin h-6 w-6 border-2 border-teal-600 border-t-transparent rounded-full mb-2"></div>
            <span className="text-sm font-medium">Translating medical details...</span>
          </div>
        ) : translatedText ? (
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Translated View</h4>
            </div>
            <div className="text-slate-700 whitespace-pre-wrap leading-relaxed text-sm">{translatedText}</div>
          </div>
        ) : (
          <div className="space-y-6">
            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Administration Instructions
              </h3>
              <p className="text-slate-700 leading-relaxed text-sm bg-slate-50/50 p-3 rounded-xl border border-slate-100">{info.dosageInstructions}</p>
            </section>

            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Indications</h3>
              <p className="text-slate-700 text-sm">{info.indications}</p>
            </section>

            <section>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Potential Side Effects</h3>
              <div className="flex flex-wrap gap-2">
                {info.sideEffects.map((effect, idx) => (
                  <span key={idx} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                    {effect}
                  </span>
                ))}
              </div>
            </section>
          </div>
        )}

        <button 
          onClick={handleQuickAddReminder}
          className="w-full mt-8 bg-teal-600 text-white py-4 rounded-2xl font-bold hover:bg-teal-700 transition-all shadow-lg hover:shadow-teal-100 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Schedule Daily Reminder
        </button>
      </div>

      <div className="bg-teal-50 rounded-3xl p-6 border border-teal-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-teal-900 flex items-center gap-2">
            <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Generic Alternatives
          </h3>
          <span className="text-[10px] font-bold text-teal-600 bg-white/50 px-2 py-1 rounded border border-teal-200 uppercase tracking-tight">Price Estimates</span>
        </div>
        
        <div className="space-y-3">
          {info.genericAlternatives.map((alt, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-teal-200 flex justify-between items-center group hover:border-teal-400 transition-all duration-300">
              <div className="flex flex-col">
                <span className="font-bold text-slate-800">{alt.name}</span>
                <span className="text-[10px] text-teal-600 font-bold uppercase tracking-widest mt-0.5">FDA Approved Generic</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{alt.priceRange}</span>
                <span className="text-[9px] text-slate-400 mt-1 italic">Est. retail price</span>
              </div>
            </div>
          ))}
          {info.genericAlternatives.length === 0 && (
            <div className="p-8 text-center bg-white/50 rounded-2xl border border-dashed border-teal-200">
              <p className="text-teal-600 italic text-sm">No specific generic alternatives found in database. Please consult with a healthcare professional or pharmacist.</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
          <svg className="h-5 w-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-[11px] text-amber-800 leading-snug">
            <strong>Price Disclaimer:</strong> Prices are rough estimates based on typical retail pharmacy data and can vary significantly based on location, insurance, and pharmacy chain. Always verify actual costs with your pharmacist.
          </p>
        </div>
      </div>
    </div>
  );
};
