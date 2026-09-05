import React, { useMemo } from 'react';
import { NANO_SKILLS_LIBRARY } from '../data/skillsLibrary';
import { NanoSkill } from '../types';
import { Sparkles, TrendingUp, Flame, Star, Award, Check } from 'lucide-react';

interface SkillDropdownProps {
  searchTerm: string;
  selectedSkills: string[];
  onSelectSkill: (skillName: string) => void;
  onClose?: () => void;
}

export const SkillDropdown: React.FC<SkillDropdownProps> = ({
  searchTerm,
  selectedSkills,
  onSelectSkill,
}) => {
  // Predictive lightning-fast prefix and keyword filtering
  const filteredSkills = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) {
      // Show top-rated skills by default
      return [...NANO_SKILLS_LIBRARY].sort((a, b) => b.rating - a.rating);
    }
    return NANO_SKILLS_LIBRARY.filter(
      (skill) =>
        skill.name.toLowerCase().includes(query) ||
        skill.category.toLowerCase().includes(query) ||
        skill.demandStatus.toLowerCase().includes(query)
    ).sort((a, b) => {
      // Prefix matching takes precedence
      const aStarts = a.name.toLowerCase().startsWith(query);
      const bStarts = b.name.toLowerCase().startsWith(query);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return b.rating - a.rating;
    });
  }, [searchTerm]);

  const getCategoryColor = (category: NanoSkill['category']) => {
    switch (category) {
      case 'Tech':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Creative Arts':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Music':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Fitness':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Media':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getDemandBadge = (status: NanoSkill['demandStatus']) => {
    switch (status) {
      case 'Highly Demanded':
        return (
          <span className="inline-flex items-center text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/80">
            <Flame className="w-3 h-3 mr-0.5 text-amber-500 fill-amber-500" />
            Highly Demanded
          </span>
        );
      case 'Trending':
        return (
          <span className="inline-flex items-center text-[10px] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200/80">
            <TrendingUp className="w-3 h-3 mr-0.5 text-teal-500" />
            Trending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
            <Award className="w-3 h-3 mr-0.5 text-slate-400" />
            {status}
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-30 divide-y divide-slate-100 max-h-72 overflow-y-auto">
      {/* Skill Suggestions Header */}
      <div className="px-3.5 py-2 bg-slate-50/90 flex items-center justify-between text-[11px] text-slate-600 font-semibold sticky top-0 backdrop-blur-xs border-b border-slate-200">
        <div className="flex items-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>Skill Directory &amp; Ratings</span>
        </div>
        <span className="text-[10px] text-slate-400 font-normal">
          {filteredSkills.length} matches found
        </span>
      </div>

      {filteredSkills.length === 0 ? (
        <div className="px-4 py-6 text-center text-xs text-slate-400">
          No skills match "{searchTerm}". You can still press enter to add a custom skill.
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkills.includes(skill.name);
            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => onSelectSkill(skill.name)}
                className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors group ${
                  isSelected ? 'bg-sky-50/40' : ''
                }`}
              >
                {/* Left side: Skill Name + Category Pill + Description */}
                <div className="flex flex-col space-y-1 pr-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {skill.name}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryColor(
                        skill.category
                      )}`}
                    >
                      {skill.category}
                    </span>
                    {getDemandBadge(skill.demandStatus)}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {skill.description}
                  </p>
                </div>

                {/* Right side: Benchmark Rating Score & Bar */}
                <div className="flex items-center space-x-3 shrink-0">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black text-slate-900 font-mono">
                        {skill.rating.toFixed(1)}
                        <span className="text-[10px] text-slate-400 font-normal">/10</span>
                      </span>
                    </div>
                    {/* Visual Comparison Progress Bar */}
                    <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-teal-500 to-sky-500 rounded-full"
                        style={{ width: `${(skill.rating / 10) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-sky-600 border-sky-600 text-white'
                        : 'border-slate-300 group-hover:border-sky-500 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
