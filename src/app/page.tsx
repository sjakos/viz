// page.tsx
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import NextLink from "next/link";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Viz</h1>
        <p className="text-lg text-muted-foreground">
          A browser-based tool for transforming, querying, and visualizing JSON data
        </p>
      </header>

      <main className="space-y-8">
        <section className="prose">
          <h2 className="text-2xl font-semibold mb-4">What is Viz?</h2>
          <p>
            Viz helps you work with JSON data in three simple steps:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Load your JSON data</li>
            <li>Transform and query it using JSONata</li>
            <li>Visualize results as graphs, tables, or file explorer views</li>
          </ul>
        </section>

        <section className="bg-muted p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <p className="mb-4">
            Head over to the Load page to begin working with your JSON data.
          </p>
          <NextLink href="/load" passHref>
            <Button>
              <Link className="mr-2 size-4" />
              Go to Load Page
            </Button>
          </NextLink>
        </section>
      </main>
    </div>
  );
}
