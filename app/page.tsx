import HeroCarousel from "@/components/hero-carousel"
import FeaturedEvents from "@/components/featured-events"
import FeaturedProjects from "@/components/featured-projects"
import LatestBlogs from "@/components/latest-blogs"
import DonationCTA from "@/components/donation-cta"
import PageVideo from "@/components/page-video"
import PageFAQ from "@/components/page-faq"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Featured Video */}
      <section className="my-12">
        <PageVideo videoId="example-video-id" />
      </section>

      {/* Featured Events */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6 text-orange-600">Upcoming Events</h2>
        <FeaturedEvents />
      </section>

      {/* Featured Projects */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6 text-orange-600">Our Projects</h2>
        <FeaturedProjects />
      </section>

      {/* Latest Blogs */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6 text-orange-600">Latest Updates</h2>
        <LatestBlogs />
      </section>

      {/* Donation CTA */}
      <section className="my-12">
        <DonationCTA />
      </section>

      {/* FAQ Section */}
      <section className="my-12">
        <h2 className="text-3xl font-bold mb-6 text-orange-600">Frequently Asked Questions</h2>
        <PageFAQ pageId="home" />
      </section>
    </div>
  )
}
