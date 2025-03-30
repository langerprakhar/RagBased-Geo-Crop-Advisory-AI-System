"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { CloudSun, LogOut } from "lucide-react"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

// Define the form values interface.
interface FormValues {
  Country: string
  Pesticide_Usage: number
  Crop: string
  Area: number
  Nitrogen: number
  K: number
  P: number
  pH: number
}

export default function Dashboard() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [serviceActive, setServiceActive] = useState(true)
  const [formValues, setFormValues] = useState<FormValues>({
    Country: "",
    Pesticide_Usage: 0,
    Crop: "",
    Area: 0,
    Nitrogen: 0,
    K: 0,
    P: 0,
    pH: 0,
  })

  // Handle input changes for both string and numeric fields.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }))
  }

  // Sample Supabase update function. Adjust the table name and fields as needed.
  const handleUpdate = (values: FormValues) => {
    if (!user) return

    supabase
      .from("user")
      .update({
        country: values.Country,
        Pesticide_Usage: values.Pesticide_Usage,
        Crop: values.Crop,
        Area: values.Area,
        Nitrogen: values.Nitrogen,
        K: values.K,
        P: values.P,
        pH: values.pH,
      })
      .eq("uid", user.id)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error updating:", error.message)
        } else {
          console.log("Update successful:", data)
        }
      })
  }

  const handleModalUpdate = () => {
    handleUpdate(formValues)
    setIsModalOpen(false)
  }

  useEffect(() => {
    if (!loading && !user) {
      router.push("/register")
    }
  }, [user, loading, router])

  const handleLogout = () => {
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-800"></div>
          <p className="text-green-800">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, don't render dashboard content.
  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="flex flex-col space-y-8">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-green-800">Welcome</h1>
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
              Update Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="default"
              className="w-full md:w-auto"
              onClick={() => setIsModalOpen(true)}
            >
              Update
            </Button>

            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-lg">
                  <h2 className="text-xl font-bold mb-1">Update Form</h2>
                  <form>
                    {/* Country Input */}
                    <div className="mb-1">
                      <label className="block text-sm font-medium mb-1" htmlFor="Country">
                        Country
                      </label>
                      <Input
                        id="Country"
                        name="Country"
                        value={formValues.Country}
                        onChange={handleChange}
                        placeholder="Enter country"
                      />
                    </div>
                    {/* Area Input */}
                    <div className="mb-1">
                      <label className="block text-sm font-medium mb-1" htmlFor="Area">
                        Area
                      </label>
                      <Input
                        type="number"
                        id="Area"
                        name="Area"
                        value={formValues.Area}
                        onChange={handleChange}
                        placeholder="Enter area (in hectares)"
                      />
                    </div>
                    {/* Crop Input */}
                    <div className="mb-1">
                      <label className="block text-sm font-medium mb-1" htmlFor="Crop">
                        Crop
                      </label>
                      <Input
                        id="Crop"
                        name="Crop"
                        value={formValues.Crop}
                        onChange={handleChange}
                        placeholder="Enter crop name"
                      />
                    </div>
                    {/* Pesticide Usage Input */}
                    <div className="mb-1">
                      <label className="block text-sm font-medium mb-1" htmlFor="Pesticide_Usage">
                        Pesticide Usage (tonnes per hectare)
                      </label>
                      <Input
                        type="number"
                        id="Pesticide_Usage"
                        name="Pesticide_Usage"
                        value={formValues.Pesticide_Usage}
                        onChange={handleChange}
                        placeholder="Enter pesticide usage"
                      />
                    </div>
                    {/* Nitrogen Input */}
                    <div className="mb-1">
                      <label className="block text-sm font-medium mb-1" htmlFor="Nitrogen">
                        Nitrogen
                      </label>
                      <Input
                        type="number"
                        id="Nitrogen"
                        name="Nitrogen"
                        value={formValues.Nitrogen}
                        onChange={handleChange}
                        placeholder="Enter nitrogen value"
                      />
                    </div>
                    {/* Potassium Input */}
                    <div className="mb-1">
                      <label className="block text-sm font-medium mb-1" htmlFor="K">
                        Potassium
                      </label>
                      <Input
                        type="number"
                        id="K"
                        name="K"
                        value={formValues.K}
                        onChange={handleChange}
                        placeholder="Enter potassium value"
                      />
                    </div>
                    {/* Phosphorus Input */}
                    <div className="mb-1">
                      <label className="block text-sm font-medium mb-1" htmlFor="P">
                        Phosphorus
                      </label>
                      <Input
                        type="number"
                        id="P"
                        name="P"
                        value={formValues.P}
                        onChange={handleChange}
                        placeholder="Enter phosphorus value"
                      />
                    </div>
                    {/* pH Input */}
                    <div className="mb-1">
                      <label className="block text-sm font-medium mb-1" htmlFor="pH">
                        pH
                      </label>
                      <Input
                        type="number"
                        id="pH"
                        name="pH"
                        value={formValues.pH}
                        onChange={handleChange}
                        placeholder="Enter pH value"
                      />
                    </div>

                  

                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button variant="default" type="button" onClick={handleModalUpdate}>
                        Update
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stop Service Card */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Stop Service</CardTitle>
            <CardDescription>
              If you want to completely stop receiving updates from AgriJyothi
            </CardDescription>
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
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Yes, Stop Service
                  </AlertDialogAction>
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
