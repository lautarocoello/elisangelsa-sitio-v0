"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/lib/language-context"
import { useToast } from "@/components/ui/use-toast"

export default function CollaborateWithMe() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    stageName: "",
    email: "",
    phone: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Send data to Google Sheets via API route
      const response = await fetch("/api/submit-to-sheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formType: "collaborate",
          data: formData,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit form")
      }

      // Show success message
      toast({
        title: t("collaborate.success"),
        duration: 3000,
      })

      // Reset form
      setFormData({
        stageName: "",
        email: "",
        phone: "",
        description: "",
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
        duration: 3000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="collaborate" className="py-20 bg-gradient-to-r from-primary-light to-secondary-light">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("collaborate.title")}</h2>

        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8">
          <p className="text-gray-700 mb-6">{t("collaborate.intro")}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="stageName">{t("collaborate.stageName")}</Label>
                <Input
                  id="stageName"
                  name="stageName"
                  value={formData.stageName}
                  onChange={handleChange}
                  placeholder={t("collaborate.stageName")}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">{t("collaborate.email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("collaborate.email")}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">{t("collaborate.phone")}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("collaborate.phone")}
                />
              </div>

              <div>
                <Label htmlFor="description">{t("collaborate.description")}</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t("collaborate.descriptionPlaceholder")}
                  rows={5}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : t("collaborate.submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

