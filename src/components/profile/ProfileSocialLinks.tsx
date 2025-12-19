import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link as LinkIcon, Twitter, Linkedin, Github, Instagram, Globe } from 'lucide-react';
import Link from 'next/link';

interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  portfolio?: string;
}

interface ProfileSocialLinksProps {
  socialLinks?: SocialLinks | null;
}

export function ProfileSocialLinks({ socialLinks }: ProfileSocialLinksProps) {
  const links = socialLinks || {};
  const hasAnyLinks = Object.values(links).some(link => link && link.trim() !== '');

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: links.twitter,
      color: 'text-blue-400 hover:text-blue-500'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: links.linkedin,
      color: 'text-blue-600 hover:text-blue-700'
    },
    {
      name: 'GitHub',
      icon: Github,
      url: links.github,
      color: 'text-gray-800 hover:text-gray-900'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: links.instagram,
      color: 'text-pink-500 hover:text-pink-600'
    },
    {
      name: 'Portfolio',
      icon: Globe,
      url: links.portfolio,
      color: 'text-green-600 hover:text-green-700'
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5 text-primary-600" />
          Social Media & Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasAnyLinks ? (
          <div className="flex flex-wrap gap-3">
            {socialPlatforms.map((platform) => {
              if (!platform.url || platform.url.trim() === '') return null;

              const Icon = platform.icon;
              return (
                <a
                  key={platform.name}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${platform.color}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{platform.name}</span>
                </a>
              );
            })}
          </div>
        ) : (
          <div className="py-4 text-center">
            <p className="mb-3 text-sm text-muted-foreground">
              No social links added yet
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile/edit">Add Links</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
