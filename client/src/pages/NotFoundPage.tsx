import { Button } from "@/components/button";
import { Section } from "@/components/section";
import { usePageTitle } from "@/lib/use-page-title";

export default function NotFoundPage() {
  usePageTitle("Page Not Found");

  return (
    <Section>
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-4xl">Page not found.</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <Button href="/" variant="primary" className="mt-8">
          Back Home
        </Button>
      </div>
    </Section>
  );
}
