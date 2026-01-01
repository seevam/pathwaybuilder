'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Clock, Star, TrendingUp, Award, Users, Play, CheckCircle2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  thumbnailUrl: string;
  category: string;
  difficulty: string;
  duration: number;
  creditCost: number;
  isPremium: boolean;
  isFeatured: boolean;
  enrollmentCount: number;
  averageRating: number;
  totalReviews: number;
  instructorName: string;
  instructorAvatar?: string;
  skillsGained: string[];
  isEnrolled?: boolean;
  progressPercent?: number;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');

  const categories = [
    'All',
    'Leadership',
    'Technology',
    'Creative Arts',
    'STEM',
    'Social Impact',
    'Entrepreneurship',
    'Personal Development',
    'College Prep',
    'Research',
    'Communication',
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    filterCourses();
  }, [searchQuery, selectedCategory, selectedDifficulty, courses]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses');
      const data = await response.json();
      setCourses(data.courses || []);
      setFilteredCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.skillsGained.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Category filter
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (course) => course.category.toLowerCase().replace('_', ' ') === selectedCategory.toLowerCase()
      );
    }

    // Difficulty filter
    if (selectedDifficulty !== 'All') {
      filtered = filtered.filter(
        (course) => course.difficulty.toLowerCase() === selectedDifficulty.toLowerCase()
      );
    }

    setFilteredCourses(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'advanced':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      leadership: 'bg-purple-100 text-purple-700',
      technology: 'bg-blue-100 text-blue-700',
      'creative arts': 'bg-pink-100 text-pink-700',
      stem: 'bg-cyan-100 text-cyan-700',
      'social impact': 'bg-green-100 text-green-700',
      entrepreneurship: 'bg-orange-100 text-orange-700',
      'personal development': 'bg-indigo-100 text-indigo-700',
      'college prep': 'bg-violet-100 text-violet-700',
      research: 'bg-teal-100 text-teal-700',
      communication: 'bg-rose-100 text-rose-700',
    };
    return colors[category.toLowerCase().replace('_', ' ')] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading courses...</p>
        </div>
      </div>
    );
  }

  const featuredCourses = courses.filter((c) => c.isFeatured);
  const recommendedCourses = filteredCourses.filter((c) => !c.isFeatured).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Discover Courses</h1>
          <p className="text-gray-600 mt-1">
            Expand your skills with curated courses tailored to your journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
            <TrendingUp className="h-3 w-3 mr-1" />
            {courses.length} Courses Available
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'All' ? 'All Levels' : diff}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      {featuredCourses.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-6 w-6 text-amber-500" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} featured getDifficultyColor={getDifficultyColor} getCategoryColor={getCategoryColor} />
            ))}
          </div>
        </section>
      )}

      {/* All/Filtered Courses */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery || selectedCategory !== 'All' || selectedDifficulty !== 'All'
              ? `Filtered Results (${filteredCourses.length})`
              : 'All Courses'}
          </h2>
        </div>

        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search query
            </p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} getDifficultyColor={getDifficultyColor} getCategoryColor={getCategoryColor} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

interface CourseCardProps {
  course: Course;
  featured?: boolean;
  getDifficultyColor: (difficulty: string) => string;
  getCategoryColor: (category: string) => string;
}

function CourseCard({ course, featured, getDifficultyColor, getCategoryColor }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <div
        className={`bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden hover:shadow-lg hover:border-indigo-300 transition-all group ${
          featured ? 'lg:flex lg:flex-row' : ''
        }`}
      >
        {/* Thumbnail */}
        <div className={`relative ${featured ? 'lg:w-1/2' : 'w-full h-48'} bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center`}>
          {course.thumbnailUrl ? (
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <BookOpen className="h-16 w-16 text-indigo-300" />
          )}
          {course.isPremium && (
            <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Lock className="h-3 w-3" />
              PREMIUM
            </div>
          )}
          {course.isEnrolled && (
            <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Enrolled
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
            <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Content */}
        <div className={`p-6 ${featured ? 'lg:w-1/2' : ''}`}>
          {/* Category & Difficulty */}
          <div className="flex items-center gap-2 mb-3">
            <Badge className={getCategoryColor(course.category)}>{course.category.replace('_', ' ')}</Badge>
            <Badge variant="outline" className={getDifficultyColor(course.difficulty)}>
              {course.difficulty}
            </Badge>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.shortDescription}</p>

          {/* Instructor */}
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {course.instructorName?.charAt(0) || 'I'}
            </div>
            <div className="text-sm">
              <div className="font-semibold text-gray-900">{course.instructorName || 'Expert Instructor'}</div>
            </div>
          </div>

          {/* Skills */}
          {course.skillsGained && course.skillsGained.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {course.skillsGained.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
                {course.skillsGained.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    +{course.skillsGained.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Progress Bar for Enrolled Courses */}
          {course.isEnrolled && course.progressPercent !== undefined && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span className="font-semibold">{course.progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${course.progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{Math.floor(course.duration / 60)}h {course.duration % 60}m</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold">{course.averageRating.toFixed(1)}</span>
                <span className="text-gray-400">({course.totalReviews})</span>
              </div>
            </div>
            {course.creditCost > 0 && (
              <div className="flex items-center gap-1 text-indigo-600 font-semibold">
                <Award className="h-4 w-4" />
                {course.creditCost}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
