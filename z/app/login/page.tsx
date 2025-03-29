"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    phone: "",
    otp: "",
  })
  const [step, setStep] = useState(1)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (step === 1) {
      setIsLoading(true)
      // Simulate OTP sending
      setTimeout(() => {
        setIsLoading(false)
        setStep(2)
      }, 1500)
      return
    }

    setIsLoading(true)
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="container mx-auto max-w-md py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-800">
            {step === 1 ? "Login to Your Account" : "Enter OTP"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 ? "Enter your phone number to receive an OTP" : "We've sent a one-time password to your phone"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {step === 1 ? (
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
            ) : (
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
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
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {step === 1 ? "Sending OTP..." : "Verifying..."}
                </>
              ) : step === 1 ? (
                "Send OTP"
              ) : (
                "Verify & Login"
              )}
            </Button>

            {step === 2 && (
              <Button type="button" variant="ghost" className="w-full" onClick={() => setStep(1)} disabled={isLoading}>
                Resend OTP
              </Button>
            )}

            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-green-600 hover:underline">
                Register here
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

