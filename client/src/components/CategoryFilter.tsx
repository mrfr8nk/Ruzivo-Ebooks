import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, GraduationCap } from "lucide-react";

export default function CategoryFilter() {
  const [activeLevel, setActiveLevel] = useState<"all" | "o-level" | "a-level">("all");

  const categories = [
    { id: "all", label: "All Books", icon: BookOpen },
    { id: "o-level", label: "O-Level", icon: GraduationCap },
    { id: "a-level", label: "A-Level", icon: GraduationCap },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeLevel === category.id;
        
        return (
          <Button
            key={category.id}
            variant={isActive ? "default" : "outline"}
            onClick={() => setActiveLevel(category.id as any)}
            className="gap-2"
            data-testid={`button-filter-${category.id}`}
          >
            <Icon className="w-4 h-4" />
            {category.label}
          </Button>
        );
      })}
    </div>
  );
}
