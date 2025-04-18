export default function Home() {
  return (
    <main>
      {/* Hero Section with reduced top margin */}
      <section className="relative min-h-[85vh] flex items-center justify-center">
        {/* If you had something like pt-24, reduce it by 20% to pt-20 */}
        <div className="container mx-auto text-center pt-20">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
            <span className="text-purple-500">Neural</span>Pulse
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mt-4 max-w-2xl mx-auto">
            Exploring the frontiers of artificial intelligence and quantum machine learning
          </p>

          {/* Rest of your hero content */}
        </div>
      </section>

      {/* Rest of your page content */}
    </main>
  )
}
