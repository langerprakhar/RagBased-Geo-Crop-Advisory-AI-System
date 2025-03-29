import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CloudSun, MessageSquare, Sprout } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12 px-4 md:py-24">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-green-800">AgriJyothi</h1>
              <p className="text-xl md:text-2xl text-green-700">Your daily AI companion for better farming</p>
              <p className="text-gray-600 text-lg">
                Get personalized weather updates, crop recommendations, and market prices - all in your local language.
              </p>
              <div className="pt-4">
                <Link href="/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                    Register Now <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1 mt-8 md:mt-0">
              <img
                src="/placeholder.svg?height=400&width=400"
                alt="Farmer using AgriJyothi"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-800">How AgriJyothi Helps You</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CloudSun className="h-10 w-10 text-green-600" />}
              title="Daily Weather Updates"
              description="Get accurate weather forecasts for your specific location every morning."
            />
            <FeatureCard
              icon={<Sprout className="h-10 w-10 text-green-600" />}
              title="Crop Recommendations"
              description="Receive personalized advice on what to plant based on your soil and climate."
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-green-600" />}
              title="Local Language Support"
              description="All information is provided in your preferred local language."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-green-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-green-800">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard number="1" title="Register Once" description="Sign up with your phone number and location." />
            <StepCard
              number="2"
              title="Receive Daily Updates"
              description="Get personalized farming information every day."
            />
            <StepCard
              number="3"
              title="Manage Anytime"
              description="Pause or stop the service from your dashboard whenever you want."
            />
          </div>

          <div className="mt-12 text-center">
            <Link href="/register">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                Start Now <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 px-4 mt-auto">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">AgriJyothi</h3>
              <p className="text-green-200">Your AI farming companion</p>
            </div>
            <div className="flex gap-4">
              <Link href="/register">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-800">
                  Register
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-green-800">
                  Login
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-green-200">
            <p>© 2025 AgriJyothi. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2 text-green-700">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

function StepCard({ number, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center text-center">
        <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4">
          {number}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-green-700">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

