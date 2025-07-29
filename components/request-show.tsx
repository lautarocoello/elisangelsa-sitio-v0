"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language-context"
import { useToast } from "@/components/ui/use-toast"

export default function RequestShow() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { t } = useLanguage()
  const { toast } = useToast()
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    socialMedia: "",
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
      // Limpieza de saltos de línea en texto largo (opcional)
      const cleanedFormData = {
        ...formData,
        description: formData.description.replace(/\s+/g, " ").trim(),
        date: date?.toISOString(),
      }

      const jsonBody = JSON.stringify({ formType: "request-show", data: cleanedFormData })

      const response = await fetch("/api/submit-to-sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: jsonBody, // ya está en una línea
      })

      if (!response.ok) throw new Error("Failed to submit form")

      toast({ title: t("request.success"), duration: 3000 })

      setFormData({ name: "", phone: "", email: "", socialMedia: "", description: "" })
      setDate(undefined)
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
    <section id="request" className="py-20 bg-gradient-to-b from-accent to-accent-dark text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("request.title")}</h2>

        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {[
                { id: "name", type: "text" },
                { id: "phone", type: "tel" },
                { id: "email", type: "email" },
                { id: "socialMedia", type: "text", placeholder: "Instagram, TikTok, etc." },
              ].map(({ id, type, placeholder }) => (
                <div key={id}>
                  <Label htmlFor={id} className="text-white">
                    {t(`request.${id}`)}
                  </Label>
                  <Input
                    id={id}
                    name={id}
                    type={type}
                    value={formData[id as keyof typeof formData]}
                    onChange={handleChange}
                    placeholder={placeholder || t(`request.${id}`)}
                    required={id !== "socialMedia"}
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                  />
                </div>
              ))}

              <div>
                <Label htmlFor="date" className="text-white">
                  {t("request.date")}
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white/20 border-white/30 text-white",
                        !date && "text-white/50",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : t("request.selectDate")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(selectedDate) => {
                        setDate(selectedDate);
                        setOpen(false); // <- cierra el calendario
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

              </div>

              <div>
                <Label htmlFor="description" className="text-white">
                  {t("request.description")}
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t("request.descriptionPlaceholder")}
                  rows={5}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : t("request.submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
