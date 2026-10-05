import React, { useState } from 'react';
import { HighlightColor, SoundProfile } from '../types';
import { X, Volume2, Palette, FileText } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightColor: HighlightColor;
  onChangeHighlightColor: (color: HighlightColor) => void;
  soundProfile: SoundProfile;
  onChangeSoundProfile: (profile: SoundProfile) => void;
  onSetCustomText: (text: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  highlightColor,
  onChangeHighlightColor,
  soundProfile,
  onChangeSoundProfile,
  onSetCustomText
}) => {
  const [customInput, setCustomInput] = useState('');

  if (!isOpen) return null;

  const handleApplyCustom = () => {
    if (customInput.trim().length > 0) {
      onSetCustomText(customInput.trim());
      onClose();
    }
  };

  const highlightOptions: Array<{ id: HighlightColor; label: string; colorClass: string }> = [
    { id: 'amber', label: 'Ambre solaire', colorClass: 'bg-amber-400' },
    { id: 'blue', label: 'Bleu électrique', colorClass: 'bg-sky-400' },
    { id: 'emerald', label: 'Émeraude jade', colorClass: 'bg-emerald-400' },
    { id: 'purple', label: 'Violet vif', colorClass: 'bg-purple-400' },
    { id: 'crimson', label: 'Pourpre corail', colorClass: 'bg-rose-400' }
  ];

  const soundOptions: Array<{ id: SoundProfile; label: string; desc: string }> = [
    { id: 'thock', label: 'Frappe sourde (Thock)', desc: 'Interrupteurs mécaniques graves et feutrés' },
    { id: 'clicky', label: 'Clic franc (Clicky)', desc: 'Déclenchement net et claquement franc' },
    { id: 'creamy', label: 'Linéaire fluide (Creamy)', desc: 'Frappe douce et acoustique atténuée' },
    { id: 'silent', label: 'Silencieux', desc: 'Aucun retour sonore lors de la frappe' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h3 className="text-xl font-bold text-stone-900">Préférences d'entraînement</h3>
            <p className="text-xs text-stone-500 mt-0.5">Personnalisez vos repères visuels et les sons mécaniques</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Color for Current Character */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-stone-600" />
            Couleur de surbrillance du caractère actif
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {highlightOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChangeHighlightColor(opt.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border transition-all text-xs font-medium ${
                  highlightColor === opt.id
                    ? 'border-stone-900 bg-stone-100 text-stone-900 ring-2 ring-stone-900/10'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full ${opt.colorClass} shadow-xs`}></span>
                <span className="truncate">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Mechanical Switch Sound Profile */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-stone-600" />
            Profil sonore mécanique
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {soundOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChangeSoundProfile(opt.id)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  soundProfile === opt.id
                    ? 'border-stone-900 bg-stone-100/80 text-stone-900'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                }`}
              >
                <span className="text-xs font-semibold text-stone-900">{opt.label}</span>
                <span className="text-[11px] text-stone-500 mt-0.5">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Text Practice */}
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-stone-600" />
            Texte d'entraînement personnalisé
          </label>
          <textarea
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Collez votre propre paragraphe, extrait ou code pour vous entraîner avec texte estompé et validation en noir gras..."
            rows={3}
            className="w-full p-3 text-xs font-mono rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 resize-none"
          />
          {customInput.trim().length > 0 && (
            <button
              onClick={handleApplyCustom}
              className="self-end px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors"
            >
              Lancer la session personnalisée
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
