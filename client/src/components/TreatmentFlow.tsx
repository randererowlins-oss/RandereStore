import React from 'react';
import { Search, CheckCircle, Sparkles, Scissors, Palette, Flame } from 'lucide-react';

const treatmentSteps = [
  {
    step: '01',
    name: 'SOURCE',
    icon: Search,
    headline: 'Hand-picked from the noise',
    detail: 'We scour East Africa’s largest thrift ecosystems and garment collections for overlooked silhouettes with rich textile weight and character.',
  },
  {
    step: '02',
    name: 'GRADE',
    icon: CheckCircle,
    headline: 'Rigorous condition audit',
    detail: 'Each garment is classified from Grade A (pristine ready-to-wear) through Grade C (prime structural transformation candidates).',
  },
  {
    step: '03',
    name: 'CLEAN',
    icon: Sparkles,
    headline: 'Sanitized & rejuvenated',
    detail: 'Garments undergo deep ultrasonic and ozone washing with organic detergents, restoring fiber softness while sterilizing thoroughly.',
  },
  {
    step: '04',
    name: 'REPAIR',
    icon: Scissors,
    headline: 'Reinforced for a decade',
    detail: 'Broken zippers replaced with heavy-duty brass, seam splits triple-stitched, and fraying edges stabilized with archival herringbone tape.',
  },
  {
    step: '05',
    name: 'REMAKE',
    icon: Palette,
    headline: 'Deconstructed & tailored',
    detail: 'Boxy crops, asymmetrical splices, sashiko patchwork, and custom heat-cured Japanese textile artwork executed directly in our studio.',
  },
  {
    step: '06',
    name: 'STYLE',
    icon: Flame,
    headline: 'Complete identity curation',
    detail: 'Garments paired into cohesive outfits designed to trigger the only reaction that matters: "Who plugged you?"',
  },
];

export const TreatmentFlow: React.FC = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-randere-border border border-randere-border">
        {treatmentSteps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.step}
              className="group p-8 bg-randere-dark flex flex-col justify-between hover:bg-neutral-900 transition-colors duration-300 min-h-[220px]"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-xs tracking-mega text-randere-muted group-hover:text-randere-accent transition-colors">
                    STAGE // {step.step}
                  </span>
                  <Icon className="w-5 h-5 text-randere-muted group-hover:text-randere-chalk transition-colors" />
                </div>
                <h3 className="text-xl font-bold tracking-tight text-randere-chalk mb-1">
                  {step.name}
                </h3>
                <p className="text-xs font-mono text-randere-accent mb-3 uppercase tracking-wider">
                  {step.headline}
                </p>
              </div>

              <p className="text-xs text-randere-muted font-light leading-relaxed">
                {step.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
