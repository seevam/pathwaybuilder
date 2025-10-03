import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-5xl font-bold">
          Pathway Builder 🎓
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Discover your strengths, explore careers, and build your future
        </p>
        
        <div className="flex gap-4 justify-center pt-4">
          <Link href="/sign-up">
            <Button size="lg">Get Started Free</Button>
          </Link>
          <Link href="/sign-in">
            <Button size="lg" variant="outline">Sign In</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
