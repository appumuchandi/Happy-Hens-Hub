import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  color?: "saffron" | "sky" | "red";
}

export default function StatCard({ title, value, icon: Icon, description, color = 'saffron' }: StatCardProps) {
  const colorClasses = {
    saffron: 'border-primary/80 text-primary',
    sky: 'border-accent/80 text-accent',
    red: 'border-destructive/80 text-destructive',
  };

  return (
    <Card className={cn("border-2 shadow-md", colorClasses[color])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
