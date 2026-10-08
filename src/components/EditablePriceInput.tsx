import React, { useState, useEffect } from 'react';
import { Currency } from '../types/realEstate';

interface EditablePriceInputProps {
  value: number;
  onChange: (val: number) => void;
  currency: Currency;
  placeholder?: string;
  min?: number;
  className?: string;
  inputClassName?: string;
  quickIncrements?: number[];
  presets?: number[];
  autoFocus?: boolean;
}

export const EditablePriceInput: React.FC<EditablePriceInputProps> = ({
  value,
  onChange,
  currency,
  placeholder = '0',
  min = 0,
  className = '',
  inputClassName = '',
  quickIncrements,
  presets,
  autoFocus = false,
}) => {
  // Local text state for buttery-smooth editing without jumping cursor
  const [text, setText] = useState<string>(() => (value > 0 ? String(value) : ''));
  const [isFocused, setIsFocused] = useState(false);

  // Synchronize when external value changes while not actively editing
  useEffect(() => {
    if (!isFocused) {
      setText(value > 0 ? String(value) : '');
    }
  }, [value, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);

    // Normalize: remove currency symbols, spaces, thousand separators (commas or dots)
    const cleaned = raw.replace(/[^\d.,]/g, '').replace(/,/g, '.');
    // If multiple dots, keep only the first
    const parts = cleaned.split('.');
    const normalized = parts.length > 1 ? `${parts[0]}.${parts.slice(1).join('')}` : cleaned;

    const parsed = parseFloat(normalized);
    if (!isNaN(parsed) && parsed >= min) {
      onChange(parsed);
    } else if (raw.trim() === '') {
      onChange(0);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value > 0) {
      setText(String(value));
    } else {
      setText('');
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    e.target.select();
  };

  const handleIncrement = (amount: number) => {
    const nextVal = Math.max(min, (value || 0) + amount);
    onChange(nextVal);
    setText(String(nextVal));
  };

  const handleSetPreset = (presetVal: number) => {
    onChange(presetVal);
    setText(String(presetVal));
  };

  const currencySymbol = currency === 'PEN' ? 'S/.' : '$';

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="relative flex items-center">
        {/* Currency Prefix Badge */}
        <span className="absolute left-3.5 font-mono font-black text-base text-[#D8B66D] pointer-events-none select-none">
          {currencySymbol}
        </span>

        {/* Text Input with Numeric Input Mode (avoids native type=number bugs with commas) */}
        <input
          type="text"
          inputMode="decimal"
          autoFocus={autoFocus}
          value={text}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full pl-12 pr-4 py-2.5 rounded-xl border border-[#DDD5C3] bg-white font-mono text-base font-bold text-[#081827] placeholder:text-[#94A3B8] placeholder:font-normal focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0284C7] focus:border-[#0284C7] transition-all shadow-xs ${inputClassName}`}
        />

        {/* Quick clear button if has value */}
        {value > 0 && (
          <button
            type="button"
            onClick={() => {
              onChange(0);
              setText('');
            }}
            title="Borrar precio"
            className="absolute right-3 text-[#94A3B8] hover:text-[#EF4444] text-xs font-mono font-bold px-1.5 py-0.5 rounded hover:bg-red-50 transition-colors cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>

      {/* Quick increments buttons (+10k, +50k, etc.) */}
      {quickIncrements && quickIncrements.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[10px] text-[#6F6456] font-semibold">Ajustar:</span>
          {quickIncrements.map((inc) => (
            <button
              key={inc}
              type="button"
              onClick={() => handleIncrement(inc)}
              className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white border border-[#DDD5C3] hover:border-[#0284C7] hover:text-[#0284C7] text-[#081827] transition-colors cursor-pointer"
            >
              {inc > 0 ? `+${inc >= 1000 ? `${inc / 1000}k` : inc}` : `${inc}`}
            </button>
          ))}
        </div>
      )}

      {/* Preset values chips */}
      {presets && presets.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          <span className="text-[10px] text-[#6F6456] font-semibold">Sugeridos:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handleSetPreset(preset)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono border transition-all cursor-pointer ${
                value === preset
                  ? 'bg-[#0284C7] text-white border-[#0284C7] font-bold shadow-xs'
                  : 'bg-[#FBF9F5] text-[#081827] border-[#DDD5C3] hover:border-[#0284C7]'
              }`}
            >
              {currencySymbol} {preset.toLocaleString()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
