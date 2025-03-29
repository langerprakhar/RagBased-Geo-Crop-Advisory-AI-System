"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CloudSun, MessageSquare, BarChart3, Settings, LogOut } from "lucide-react"

export default function Dashboard() {
  const router = useRouter()
  const [serviceActive, setServiceActive] = useState(true)

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex flex-col space-y-8">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-green-800">Welcome, Farmer</h1>
                <p className="text-green-700">Your daily farming assistant is active</p>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="service-status" checked={serviceActive} onCheckedChange={setServiceActive} />
                <Label htmlFor="service-status" className="font-medium text-green-800">
                  {serviceActive ? "Service Active" : "Service Paused"}
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Today's Updates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <CloudSun className="mr-2 h-5 w-5" />
              Today's Updates
            </CardTitle>
            <CardDescription>Information for your farm in Village Name, District</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h3 className="font-medium text-blue-800 mb-1">Weather Forecast</h3>
              <p className="text-blue-700">Sunny with occasional clouds. Temperature: 28°C - 32°C</p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
              <h3 className="font-medium text-amber-800 mb-1">Crop Advisory</h3>
              <p className="text-amber-700">
                Good time to apply fertilizer to your rice crop. Ensure proper irrigation.
              </p>
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
              <h3 className="font-medium text-emerald-800 mb-1">Market Prices</h3>
              <p className="text-emerald-700">Rice: ₹2,100/quintal (↑5%), Wheat: ₹2,400/quintal (↑2%)</p>
            </div>
          </CardContent>
        </Card>

        {/* Service Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-green-600" />
                Language
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Current: Hindi</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Change Language
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <BarChart3 className="mr-2 h-5 w-5 text-green-600" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">View your past updates</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                View History
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Settings className="mr-2 h-5 w-5 text-green-600" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Manage your preferences</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Open Settings
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Stop Service */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Stop Service</CardTitle>
            <CardDescription>If you want to completely stop receiving updates from AgriJyothi</CardDescription>
          </CardHeader>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full md:w-auto">
                  Stop AgriJyothi Service
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently stop the AgriJyothi service. You will no longer receive daily updates. You can
                    always register again later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">Yes, Stop Service</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>

        {/* Logout Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}

