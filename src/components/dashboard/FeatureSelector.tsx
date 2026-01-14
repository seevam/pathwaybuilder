'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { GraduationCap, Rocket, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type Feature = 'CAREER_EXPLORATION' | 'PASSION_PROJECT' | 'IB_LEARNING';

interface FeatureSelectorProps {
  currentFeature: Feature;
}

const features = [
  {
    id: 'CAREER_EXPLORATION' as Feature,
    name: 'Career Exploration',
    description: 'Discover your strengths, values, and ideal career paths',
    icon: Compass,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  {
    id: 'PASSION_PROJECT' as Feature,
    name: 'Passion Project',
    description: 'Build meaningful projects that showcase your talents',
    icon: Rocket,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
  },
  {
    id: 'IB_LEARNING' as Feature,
    name: 'IB Learning',
    description: 'Master IB subjects with AI-powered Socratic tutoring',
    icon: GraduationCap,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
];

export function FeatureSelector({ currentFeature }: FeatureSelectorProps) {
  const [selectedFeature, setSelectedFeature] = useState<Feature>(currentFeature);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleFeatureSelect = async (featureId: Feature) => {
    if (featureId === selectedFeature || isUpdating) return;

    setIsUpdating(true);
    setSelectedFeature(featureId);

    try {
      const response = await fetch('/api/user/update-feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: featureId }),
      });

      if (!response.ok) throw new Error('Failed to update feature');

      toast.success('Dashboard updated!');

      // Refresh the page to show new content
      window.location.reload();
    } catch (error) {
      console.error('Error updating feature:', error);
      toast.error('Failed to update dashboard. Please try again.');
      setSelectedFeature(currentFeature);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Choose Your Focus</h2>
        <p className="text-gray-600 mt-1">Select the feature you want to explore</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isSelected = selectedFeature === feature.id;

          return (
            <Card
              key={feature.id}
              className={cn(
                'relative cursor-pointer transition-all duration-200 hover:shadow-lg',
                'border-2',
                isSelected
                  ? `${feature.borderColor} ${feature.bgColor} shadow-md`
                  : 'border-gray-200 hover:border-gray-300',
                isUpdating && 'opacity-50 cursor-wait'
              )}
              onClick={() => handleFeatureSelect(feature.id)}
            >
              <div className="p-6 space-y-4">
                {/* Icon with gradient background */}
                <div
                  className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center',
                    `bg-gradient-to-br ${feature.color}`
                  )}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* Feature name */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{feature.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{feature.description}</p>
                </div>

                {/* Selected indicator */}
                {isSelected && (
                  <div className={cn('flex items-center gap-2 text-sm font-semibold', feature.textColor)}>
                    <div className={cn('w-2 h-2 rounded-full', `bg-gradient-to-br ${feature.color}`)} />
                    Currently Active
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
