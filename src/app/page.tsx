import { getAllIndustries } from "@/lib/data-service";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { SearchBar } from "@/components/home/SearchBar";
import { IndustryGrid } from "@/components/home/IndustryGrid";

export default function HomePage() {
  const industries = getAllIndustries();

  return (
    <div className="relative">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-brand-500/5 blur-3xl dark:bg-brand-500/10" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <HeroSection />

        {/* Stats */}
        <StatsBar />

        {/* Search */}
        <SearchBar />

        {/* Industry Grid */}
        <section className="pb-24">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
              Explore by Industry
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Browse AI skills tailored to your field
            </p>
          </div>
          <IndustryGrid industries={industries} />
        </section>
      </div>
    </div>
  );
}
