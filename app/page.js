import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Next.js
        </h1>

        <Button className="">Click me</Button>
        <p className="text-lg text-gray-600 bg-gray-200 p-4 rounded-lg">
          Your Next.js application is ready to go!
        </p>
      </div>
    </div>
  );
}

