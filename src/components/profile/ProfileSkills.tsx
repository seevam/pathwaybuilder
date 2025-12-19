import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';
import Link from 'next/link';

interface ProfileSkillsProps {
  skills: string[];
}

export function ProfileSkills({ skills = [] }: ProfileSkillsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary-600" />
          Skills & Expertise
        </CardTitle>
      </CardHeader>
      <CardContent>
        {skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-purple-100 text-purple-700 hover:bg-purple-200"
              >
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              No skills added yet
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile/edit">Add Skills</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
