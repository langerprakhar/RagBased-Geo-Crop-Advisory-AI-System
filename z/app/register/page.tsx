"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function Register() {
  const { user } = useAuth()
  const { signIn, verifyOTP } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    language: "",
    state: "",
    district: "",
    village: "",
    otp: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (step === 1) {
        setStep(2)
        setIsLoading(false)
        return
      }

      if (step === 2) {
        await signIn(formData.phone)
        setStep(3)
        setIsLoading(false)
        return
      }

      if (step === 3) {
        await verifyOTP(formData.phone, formData.otp)

        const { data: userData, error: userError } = await supabase.auth.getUser()
        
        if (userError || !userData.user) {
          throw new Error("Failed to get user data")
        }

        const { error: dbError } = await supabase
          .from('user')
          .insert([
            {
            uid: userData.user.id,
            full_name: formData.name,
            phone_no: formData.phone,
            language: formData.language,
            country: "India",
            Area: 1,
            Pesticide_Usage: 2,
            Crop: "a",
            Nitrogen: 2,
            P: 2,
            pH: 3,
          }
        ])

        if (dbError) {
          console.error("DB Error:", dbError.message)
          return
        }

      router.push("/dashboard")
    }} catch (error) {
      console.error('Error:', JSON.stringify(error, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-800">
            {step === 3 ? "Verify Your Phone" : step === 2 ? "Your Location" : "Create Your Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 3 
              ? "Enter the OTP sent to your phone" 
              : step === 2 
              ? "We need your location to provide accurate information"
              : "Enter your details to get started with AgriJyothi"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Preferred Language</Label>
                  <Select
                    name="language"
                    value={formData.language}
                    onValueChange={(value) => handleSelectChange("language", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your preferred language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindi">Hindi</SelectItem>
                      <SelectItem value="tamil">Tamil</SelectItem>
                      <SelectItem value="telugu">Telugu</SelectItem>
                      <SelectItem value="kannada">Kannada</SelectItem>
                      <SelectItem value="malayalam">Malayalam</SelectItem>
                      <SelectItem value="marathi">Marathi</SelectItem>
                      <SelectItem value="punjabi">Punjabi</SelectItem>
                      <SelectItem value="bengali">Bengali</SelectItem>
                      <SelectItem value="english">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            ) : step === 2 ? (
              // Keep existing step 2 form exactly as is
              <>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select
                    name="state"
                    value={formData.state}
                    onValueChange={(value) => handleSelectChange("state", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="punjab">Punjab</SelectItem>
                      <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="west-bengal">West Bengal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">Crop</Label>
                  <Input
                    id="district"
                    name="district"
                    placeholder="Enter your Crop"
                    required
                    value={formData.district}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="village">Area</Label>
                  <Input
                    id="village"
                    name="village"
                    placeholder="0"
                    required
                    value={formData.village}
                    onChange={handleChange}
                  />
                </div>
              </>
            ) : (
              // New simple OTP input form for step 3
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  placeholder="Enter the 6-digit OTP"
                  required
                  maxLength={6}
                  value={formData.otp}
                  onChange={handleChange}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : step === 3 ? (
                "Verify & Complete Registration"
              ) : step === 2 ? (
                "Send OTP"
              ) : (
                "Continue"
              )}
            </Button>

            {step > 1 && (
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => setStep(step - 1)}
                disabled={isLoading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}

            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-green-600 hover:underline">
                Login here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
