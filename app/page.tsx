import HeroCarousel from "@/components/hero-carousel"
import FeaturedEvents from "@/components/featured-events"
import FeaturedProjects from "@/components/featured-projects"
import LatestBlogs from "@/components/latest-blogs"
import DonationCTA from "@/components/donation-cta"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"
import StatsSection from "@/components/stats-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroCarousel />
      <StatsSection />
      <FeaturedEvents />
      <FeaturedProjects />
      <LatestBlogs />
      <PageVideo />
      <DonationCTA />
      <PageFAQ pageId="faq" />
    </div>
  )
}
