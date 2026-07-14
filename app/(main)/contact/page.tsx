import ContactForm from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact | FINIDY Research Center",
  description:
    "Contactez le FINIDY Research Center pour toute question sur une soumission, une consultance, un partenariat ou un problème technique.",
  openGraph: {
    title: "Contact — FINIDY Research Center",
    description: "Envoyez-nous un message, nous vous répondrons sous 3 jours ouvrés.",
    type: "website" as const,
    url: "https://finidy.mg/contact",
  },
  alternates: { canonical: "https://finidy.mg/contact" },
};

export default function ContactPage() {
  return <ContactForm />;
}
