"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, MapPin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  getDay
} from "date-fns"
import { useLanguage } from "@/lib/language-context"

export default function WhereToFindMe() {
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [upcomingShows, setUpcomingShows] = useState<
    { date: Date; title: string; location: string; link?: string }[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await fetch("/api/submit-to-sheets")
        const data = await response.json()

        if (data.error) {
          setError(true)
        } else {
          setUpcomingShows(
            data.upcomingShows.map(
              (show: { date: string; title: string; location: string; link?: string }) => ({
                date: new Date(show.date),
                title: show.title,
                location: show.location,
                link: show.link // link opcional que viene de la columna D
              })
            )
          )
        }
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchShows()
  }, [])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const firstDayIndex = getDay(monthStart)

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  const getShowsForDate = (date: Date) =>
    upcomingShows.filter((show) => isSameDay(show.date, date))
  const showsForSelectedDate = selectedDate ? getShowsForDate(selectedDate) : []

  return (
    <section id="calendar" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("calendar.title")}</h2>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <Button variant="ghost" className="text-white hover:bg-primary/90" onClick={prevMonth}>
              <ChevronLeft size={20} />
            </Button>
            <h3 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h3>
            <Button variant="ghost" className="text-white hover:bg-primary/90" onClick={nextMonth}>
              <ChevronRight size={20} />
            </Button>
          </div>

          {loading ? (
            <div className="p-6 text-center">⏳ {t("calendar.loading")}</div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{t("calendar.error")}</div>
          ) : (
            <>
              <div className="grid grid-cols-7 gap-1 p-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center font-medium text-sm py-2">
                    {day}
                  </div>
                ))}

                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty${i}`} className="min-h-[80px] p-1"></div>
                ))}

                {monthDays.map((day, i) => {
                  const shows = getShowsForDate(day)
                  const hasShow = shows.length > 0
                  const isSelected = selectedDate && isSameDay(day, selectedDate)

                  return (
                    <div
                      key={i}
                      className={`min-h-[80px] p-1 border rounded-md relative
                        ${!isSameMonth(day, currentMonth) ? "bg-gray-100 text-gray-400" : ""}
                        ${isToday(day) ? "border-primary" : ""}
                        ${isSelected ? "bg-primary/10 border-primary" : ""}
                        ${hasShow ? "cursor-pointer hover:bg-primary/5" : ""}
                      `}
                      onClick={() => hasShow && setSelectedDate(day)}
                    >
                      <div className="text-right text-sm p-1">{format(day, "d")}</div>

                      {hasShow && (
                        <div className="absolute bottom-1 left-1 right-1">
                          <Badge className="bg-primary text-xs w-full justify-center">
                            {shows.length} {shows.length === 1 ? t("calendar.show") : t("calendar.shows")}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {selectedDate && showsForSelectedDate.length > 0 && (
                <div className="p-4 border-t">
                  <h4 className="font-semibold mb-2">
                    {t("calendar.showsOn")} {format(selectedDate, "MMMM d, yyyy")}:
                  </h4>
                  <div className="space-y-2">
                    {showsForSelectedDate.map((show, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-md flex justify-between items-center">
                        <div>
                          <div className="font-medium">{show.title}</div>
                          <div className="text-sm text-gray-600 flex items-center mt-1">
                            <MapPin size={16} className="mr-1" />
                            {show.location}
                          </div>
                        </div>
                        {/* Mostrar link si existe */}
                        {show.link && (
                          <a
                            href={show.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 rounded-md border border-primary px-3 py-1 text-sm font-medium text-primary hover:bg-primary/10"
                          >
                            <span>VER EVENTO</span>
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
