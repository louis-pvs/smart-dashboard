import { Button } from "@repo/ui/components/base/button";

export default function Overview() {
  return (
    <section className="overflow-y-auto overflow-x-hidden py-8">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Overview</h1>
        <p className="text-muted-foreground">
          This is the overview page. You can add your content here.
        </p>
        <div className="flex gap-4 flex-wrap">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">link</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </div>
    </section>
  );
}
