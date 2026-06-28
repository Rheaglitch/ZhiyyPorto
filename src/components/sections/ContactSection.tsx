import { Mail, Github, Linkedin, Instagram, MapPin } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "ohmyliinnn@gmail.com",
    href: "mailto:ohmyliinnn@gmail.com",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/Rheaglitch",
    href: "https://github.com/Rheaglitch",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/reavlenia",
    href: "https://linkedin.com/",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@reavlenia",
    href: "https://instagram.com/",
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-6" style={{ background: "var(--section-alt)" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-blood-600 font-mono text-sm tracking-widest uppercase">
            — Get In Touch —
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-dark-100">
            Let&apos;s <span className="text-gradient-blood">Connect</span>
          </h2>
          <p className="mt-3 text-dark-500 text-sm max-w-md mx-auto leading-relaxed">
            Ada project menarik, mau kolaborasi, atau sekadar ngobrol?
            Aku selalu terbuka — reach out kapan saja.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact links */}
          <div className="space-y-3">
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-dark-800/60 bg-dark-900/20 hover:border-blood-900/60 hover:bg-dark-900/50 group transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-blood-950 border border-blood-900/60 flex items-center justify-center shrink-0 group-hover:bg-blood-900/60 transition-colors">
                  <Icon size={16} className="text-blood-400" />
                </div>
                <div>
                  <p className="text-[11px] text-dark-600 font-mono">{label}</p>
                  <p className="text-sm text-dark-300 group-hover:text-blood-400 transition-colors">
                    {value}
                  </p>
                </div>
              </a>
            ))}

            <div className="flex items-center gap-4 p-4 rounded-xl border border-dark-800/60 bg-dark-900/20">
              <div className="w-9 h-9 rounded-lg bg-blood-950 border border-blood-900/60 flex items-center justify-center shrink-0">
                <MapPin size={16} className="text-blood-400" />
              </div>
              <div>
                <p className="text-[11px] text-dark-600 font-mono">Location</p>
                <p className="text-sm text-dark-300">Indonesia 🇮🇩</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

function ContactForm() {
  return (
    <form
      action="https://formspree.io/f/your-form-id"
      method="POST"
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-[11px] font-mono text-dark-600 mb-1.5">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            className="w-full px-4 py-2.5 rounded-lg bg-dark-900/60 border border-dark-800 text-dark-200 placeholder-dark-700 text-sm focus:outline-none focus:border-blood-800 transition-colors"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-[11px] font-mono text-dark-600 mb-1.5">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="w-full px-4 py-2.5 rounded-lg bg-dark-900/60 border border-dark-800 text-dark-200 placeholder-dark-700 text-sm focus:outline-none focus:border-blood-800 transition-colors"
          />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-[11px] font-mono text-dark-600 mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Hei, aku mau ngobrol soal..."
          className="w-full px-4 py-2.5 rounded-lg bg-dark-900/60 border border-dark-800 text-dark-200 placeholder-dark-700 text-sm focus:outline-none focus:border-blood-800 transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-blood-700 hover:bg-blood-600 text-white font-medium text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blood-900/30"
      >
        Kirim Pesan
      </button>
    </form>
  );
}
