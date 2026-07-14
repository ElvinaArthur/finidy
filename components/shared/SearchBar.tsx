"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export default function SearchBar({
  placeholder = "Rechercher un article, un auteur, une discipline…",
  defaultValue = "",
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/recherche?q=${encodeURIComponent(q)}` : "/recherche");
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <Search
        size={16}
        strokeWidth={1.75}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-nihary-gris-clair pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2 rounded-nihary border border-nihary-sable-fonce
          bg-white text-sm text-nihary-ambre-fonce font-body
          placeholder:text-nihary-gris-clair
          focus:outline-none focus:ring-2 focus:ring-nihary-or focus:border-nihary-or
          transition-colors duration-200"
      />
    </form>
  );
}
