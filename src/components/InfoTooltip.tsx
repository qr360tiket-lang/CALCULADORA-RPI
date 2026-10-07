import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

interface InfoTooltipProps {
  title: string;
  content: string | React.ReactNode;
  badge?: string;
}

export const InfoTooltip: React.FC<InfoTooltipProps> = ({ title, content, badge }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#9C8E77] hover:text-[#091C2C] transition-colors focus:outline-none p-0.5 rounded"
        title="Más información"
        aria-label="Más información"
      >
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 bottom-full mb-2 w-72 sm:w-80 p-3.5 bg-[#091C2C] text-[#F6F4EF] rounded-xl shadow-2xl border border-[#D8B66D]/40 z-50 text-xs text-left animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between gap-2 mb-1.5 pb-1 border-b border-[#DDD5C3]/20">
            <div className="flex items-center gap-1.5 font-semibold text-[#D8B66D]">
              <span>{title}</span>
              {badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#D8B66D]/20 text-[#D8B66D] font-mono">
                  {badge}
                </span>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-[#DDD5C3]/60 hover:text-[#F6F4EF] transition-colors p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="text-[#DDD5C3] leading-relaxed">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};
