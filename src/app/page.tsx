import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StoreSections from "@/components/store/StoreSections";

export default function Home() {
  return (
    <main className="bg-white">
      <Navbar />
      <Hero />
      <StoreSections />
    </main>
  );
}
