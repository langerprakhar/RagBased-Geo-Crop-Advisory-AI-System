import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Lightbulb, Award, Sprout } from "lucide-react"

export default function About() {
  return (
    <div className="container mx-auto max-w-5xl py-12 px-4">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">About AgriJyothi</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering farmers across India with AI-powered insights and personalized agricultural guidance.
        </p>
      </div>

      {/* Our Mission */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Our Mission</h2>
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <p className="text-gray-700 leading-relaxed">
            AgriJyothi was founded with a simple yet powerful mission: to make modern agricultural knowledge and
            technology accessible to every farmer in India, regardless of their location or technical literacy. We
            believe that by providing timely, localized, and actionable information, we can help farmers increase their
            yields, reduce costs, and improve their livelihoods.
          </p>
        </div>
      </section>

      {/* How It Works (Detailed) */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-green-700 mb-6">How AgriJyothi Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Sprout className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Data Collection</h3>
                </div>
                <p className="text-gray-600 flex-grow">
                  Our system collects data from multiple sources including weather stations, satellite imagery, soil
                  sensors, and market information systems. This data is processed and analyzed to generate insights
                  specific to your location and crops.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Lightbulb className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">AI Analysis</h3>
                </div>
                <p className="text-gray-600 flex-grow">
                  Our advanced AI algorithms analyze this data along with historical patterns to generate personalized
                  recommendations for your farm. The AI continuously learns and improves based on feedback and results.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Localization</h3>
                </div>
                <p className="text-gray-600 flex-grow">
                  All information is translated into your preferred local language and adapted to your specific
                  agricultural context. We ensure that the advice is relevant to your region's farming practices and
                  conditions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">Daily Updates</h3>
                </div>
                <p className="text-gray-600 flex-grow">
                  Every morning, you receive personalized updates with weather forecasts, crop recommendations, market
                  prices, and other relevant information to help you make informed decisions for the day.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Team */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-green-700 mb-6">The Team Behind AgriJyothi</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TeamMember
            name="Anuron Dutta"
            role="Founder & CEO"
            bio="Agricultural expert with 15 years of experience in developing technology solutions for rural farmers."
          />
          <TeamMember
            name="Dr. Priya Sharma"
            role="Chief Agricultural Scientist"
            bio="PhD in Agricultural Sciences with expertise in sustainable farming practices and crop optimization."
          />
          <TeamMember
            name="Rajesh Kumar"
            role="Head of Technology"
            bio="AI specialist focused on developing accessible technology solutions for rural communities."
          />
        </div>
      </section>

      {/* Impact */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-green-700 mb-6">Our Impact</h2>
        <div className="bg-green-50 p-6 rounded-lg border border-green-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-green-600 mb-2">50,000+</p>
              <p className="text-gray-700">Farmers Served</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600 mb-2">12</p>
              <p className="text-gray-700">States Covered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-600 mb-2">30%</p>
              <p className="text-gray-700">Average Yield Increase</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center mt-12">
        <h2 className="text-2xl font-bold text-green-800 mb-4">Ready to Transform Your Farming?</h2>
        <p className="text-gray-600 mb-6">
          Join thousands of farmers who are already benefiting from AgriJyothi's personalized guidance.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              Register Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
              Contact Us
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function TeamMember({ name, role, bio }) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
        <Users className="h-10 w-10 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-green-700 text-center mb-1">{name}</h3>
      <p className="text-gray-500 text-center text-sm mb-3">{role}</p>
      <p className="text-gray-600 text-center">{bio}</p>
    </div>
  )
}

