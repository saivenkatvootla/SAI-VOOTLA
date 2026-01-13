
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { MedicineScanner } from './components/MedicineScanner';
import { MedicineDetails } from './components/MedicineDetails';
import { ReminderDashboard } from './components/ReminderDashboard';
import { ViewState, MedicineInfo, Reminder } from './types';
import { searchGenericAlternatives } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewState>(ViewState.HOME);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineInfo | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Load reminders from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('med_reminders');
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem('med_reminders', JSON.stringify(reminders));
  }, [reminders]);

  // Check for reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHHMM = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      
      reminders.forEach(r => {
        if (r.time === currentHHMM && r.lastNotified !== now.toDateString()) {
          // In a real app we'd trigger a native notification here
          alert(`REMINDER: Time to take ${r.dosage} of ${r.medicineName}`);
          setReminders(prev => prev.map(rem => rem.id === r.id ? { ...rem, lastNotified: now.toDateString() } : rem));
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [reminders]);

  const handleScanResult = (info: MedicineInfo) => {
    setSelectedMedicine(info);
    setActiveView(ViewState.DETAILS);
  };

  const handleManualSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await searchGenericAlternatives(searchQuery);
      setSelectedMedicine(result);
      setActiveView(ViewState.DETAILS);
    } catch (err) {
      alert("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const addReminder = (newReminder: Omit<Reminder, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setReminders(prev => [...prev, { ...newReminder, id }]);
    setActiveView(ViewState.REMINDERS);
  };

  const removeReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <Layout activeView={activeView} onNavigate={setActiveView}>
      {activeView === ViewState.HOME && (
        <div className="space-y-8 py-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Your Health Assistant</h2>
            <p className="text-slate-500">Scan labels, find generics, and never miss a dose.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setActiveView(ViewState.SCAN)}
              className="flex flex-col items-center justify-center p-6 bg-teal-50 rounded-3xl border border-teal-100 hover:bg-teal-100 transition-all group active:scale-95"
            >
              <div className="bg-teal-600 text-white p-3 rounded-2xl mb-3 shadow-lg group-hover:shadow-teal-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <span className="font-bold text-teal-900">Scan Label</span>
            </button>
            <button 
              onClick={() => setActiveView(ViewState.SEARCH)}
              className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-3xl border border-blue-100 hover:bg-blue-100 transition-all group active:scale-95"
            >
              <div className="bg-blue-600 text-white p-3 rounded-2xl mb-3 shadow-lg group-hover:shadow-blue-200">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <span className="font-bold text-blue-900">Find Generics</span>
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Today's Schedule
            </h3>
            {reminders.length > 0 ? (
              <div className="space-y-3">
                {reminders.slice(0, 2).map(r => (
                  <div key={r.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-teal-600 font-mono font-bold">{r.time}</span>
                    <span className="text-slate-700 font-medium truncate flex-1">{r.medicineName}</span>
                  </div>
                ))}
                {reminders.length > 2 && <p className="text-center text-xs text-slate-400 font-medium">+ {reminders.length - 2} more</p>}
              </div>
            ) : (
              <p className="text-slate-400 text-sm text-center py-4 italic">No medication scheduled for today.</p>
            )}
            <button 
              onClick={() => setActiveView(ViewState.REMINDERS)}
              className="w-full mt-4 text-sm font-bold text-teal-600 py-2 border border-teal-200 rounded-xl hover:bg-teal-50 transition-colors"
            >
              View Full Schedule
            </button>
          </div>

          <div className="rounded-3xl overflow-hidden relative group cursor-pointer" onClick={() => setActiveView(ViewState.SCAN)}>
            <img src="https://picsum.photos/seed/meds/600/300" alt="Medicine bottles" className="w-full h-40 object-cover brightness-75 transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-wider opacity-80">Quick Tip</p>
              <h4 className="text-lg font-bold">Generic drugs must meet the same FDA standards as brand names.</h4>
            </div>
          </div>
        </div>
      )}

      {activeView === ViewState.SCAN && <MedicineScanner onResult={handleScanResult} />}

      {activeView === ViewState.SEARCH && (
        <div className="py-6 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800">Generic Search</h2>
            <p className="text-slate-500 mt-2">Enter the name of a brand-name drug to find its generic equivalent.</p>
          </div>
          <form onSubmit={handleManualSearch} className="relative">
            <input 
              type="text" 
              placeholder="e.g. Advil, Lipitor, Zyrtec..."
              className="w-full p-5 pl-6 bg-white border border-slate-200 rounded-3xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button 
              type="submit"
              disabled={isSearching}
              className="absolute right-3 top-3 bg-blue-600 text-white p-2 px-6 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-md flex items-center gap-2"
            >
              {isSearching ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> : 'Search'}
            </button>
          </form>

          <div className="grid grid-cols-2 gap-4 mt-8">
            {['Ibuprofen', 'Acetaminophen', 'Loratadine', 'Omeprazole'].map(med => (
              <button 
                key={med}
                onClick={() => {setSearchQuery(med); }}
                className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 text-sm font-medium hover:border-blue-200 hover:text-blue-600 transition-all text-left"
              >
                {med}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeView === ViewState.DETAILS && selectedMedicine && (
        <MedicineDetails info={selectedMedicine} onAddReminder={addReminder} />
      )}

      {activeView === ViewState.REMINDERS && (
        <ReminderDashboard 
          reminders={reminders} 
          onRemove={removeReminder} 
          onAddClick={() => {
            setSearchQuery('');
            setActiveView(ViewState.SEARCH);
          }} 
        />
      )}
    </Layout>
  );
};

export default App;
