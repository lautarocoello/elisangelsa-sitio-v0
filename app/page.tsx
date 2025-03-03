import Hero from "@/components/hero"
import MyShows from "@/components/my-shows"
import WhoIAm from "@/components/who-i-am"
import RequestShow from "@/components/request-show"
import WhereToFindMe from "@/components/where-to-find-me"
import CollaborateWithMe from "@/components/collaborate-with-me"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <MyShows />
      <WhoIAm />
      <RequestShow />
      <WhereToFindMe />
      <CollaborateWithMe />
      <Footer />
      <Toaster />
    </main>
  )
}

