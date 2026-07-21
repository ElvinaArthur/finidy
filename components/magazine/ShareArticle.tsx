"use client";

import { Share2 } from "lucide-react";

export default function ShareArticle({ title }: { title: string }) {
  const share = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`À lire sur FINIDY : ${window.location.href}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <button type="button" onClick={share} className="btn-outline">
      <Share2 size={15} />
      Partager
    </button>
  );
}
