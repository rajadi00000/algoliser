import { Clock, HardDrive, Tag, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { AlgorithmMeta } from '../types';

interface AlgorithmInfoProps {
  meta: AlgorithmMeta;
}

export default function AlgorithmInfo({ meta }: AlgorithmInfoProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div className="bg-bg-surface border border-bg-overlay rounded-xl p-4 space-y-4 text-sm animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white text-base">{meta.name}</h3>
          <p className="text-slate-400 text-xs mt-0.5">{meta.description}</p>
        </div>
        <span
          className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full font-medium border ${
            meta.stable
              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
              : 'border-rose-500/30 text-rose-400 bg-rose-500/10'
          }`}
        >
          {meta.stable ? 'Stable' : 'Unstable'}
        </span>
      </div>

      {/* Complexity table */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-bg-elevated rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase tracking-wide">
            <Clock size={12} />
            Time Complexity
          </div>
          <div className="space-y-1">
            {(['best', 'average', 'worst'] as const).map(k => (
              <div key={k} className="flex items-center justify-between">
                <span className="text-slate-500 capitalize text-xs">{k}</span>
                <span className="font-mono text-xs font-medium text-violet-300">{meta.timeComplexity[k]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-elevated rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase tracking-wide">
            <HardDrive size={12} />
            Space
          </div>
          <div className="flex items-center justify-center h-12">
            <span className="font-mono text-lg font-semibold text-amber-300">{meta.spaceComplexity}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium uppercase tracking-wide mt-2">
            <Tag size={12} />
            Category
          </div>
          <span className="inline-block capitalize text-xs px-2 py-0.5 bg-brand/20 text-brand-lighter rounded-full">
            {meta.category}
          </span>
        </div>
      </div>

      {/* Pseudocode toggle */}
      <button
        onClick={() => setShowCode(v => !v)}
        className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-white transition-colors bg-bg-elevated px-3 py-2 rounded-lg"
      >
        <span className="flex items-center gap-1.5">
          <BookOpen size={12} />
          Pseudocode
        </span>
        {showCode ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {showCode && (
        <pre className="bg-bg-base rounded-lg p-3 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
          {meta.pseudoCode.join('\n')}
        </pre>
      )}
    </div>
  );
}
