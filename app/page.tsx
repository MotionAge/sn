import HeroCarousel from "@/components/hero-carousel"
import StatsSection from "@/components/stats-section"
import FeaturedEvents from "@/components/featured-events"
import FeaturedProjects from "@/components/featured-projects"
import LatestBlogs from "@/components/latest-blogs"
import DonationCTA from "@/components/donation-cta"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"

export default function HomePage() {
  return (
    <main>
      <HeroCarousel />
      <StatsSection />
      <FeaturedEvents />
      <FeaturedProjects />
      <LatestBlogs />
      <DonationCTA />
      <PageVideo />
      <PageFAQ />
    </main>
  )
}
