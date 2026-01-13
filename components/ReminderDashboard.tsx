
import React from 'react';
import { Reminder } from '../types';

interface ReminderDashboardProps {
  reminders: Reminder[];
  onRemove: (id: string) => void;
  onAddClick: () => void;
}

export const ReminderDashboard: React.FC<ReminderDashboardProps> = ({ reminders, onRemove, onAddClick }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-800">My Medication Schedule</h2>
        <button 
          onClick={onAddClick}
          className="text-teal-600 font-bold text-sm bg-teal-50 px-3 py-1.5 rounded-full border border-teal-100 hover:bg-teal-100 transition-colors"
        >
          + Add New
        </button>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <svg className="h-12 w-12 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-400 font-medium">No active reminders.</p>
          <p className="text-slate-300 text-xs mt-1">Scan a label to add one automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.sort((a, b) => a.time.localeCompare(b.time)).map(reminder => (
            <div key={reminder.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group">
              <div className="bg-teal-600 text-white p-3 rounded-2xl shadow-inner font-mono font-bold">
                {reminder.time}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-800">{reminder.medicineName}</h4>
                <p className="text-xs text-slate-500">{reminder.dosage}</p>
                <div className="flex gap-1 mt-2">
                  {['M','T','W','T','F','S','S'].map((day, i) => (
                    <span key={i} className="text-[10px] w-4 h-4 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 font-bold">
                      {day}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => onRemove(reminder.id)}
                className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 transition-all"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
        <h3 className="text-indigo-900 font-bold mb-2">Safe Medication Tips</h3>
        <ul className="text-sm text-indigo-700 space-y-2">
          <li className="flex gap-2">
            <span className="text-indigo-400">•</span>
            Never skip a dose unless advised by a doctor.
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-400">•</span>
            Keep medicines in a cool, dry place.
          </li>
          <li className="flex gap-2">
            <span className="text-indigo-400">•</span>
            Generic drugs have the same quality as brand names.
          </li>
        </ul>
      </div>
    </div>
  );
};
