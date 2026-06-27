import { Mail, Github, Linkedin, Instagram, MapPin } from "lucide-react";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@zhiyy.dev",
    href: "mailto:hello@zhiyy.dev",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/zhiyy",
    href: "https://github.com/",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/zhiyy",
    href: "https://linkedin.com/",
  },
  {
    icon: Instagram,
    label: "Instagram",
    value: "@zhiyy",
    href: "https://instagram.com/",
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-blood-600 font-mono text-sm tracking-widest uppercase">
            — Get In Touch —
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-dark-100">
            Let&apos;s <span className="text-gradient-blood">Connect</span>
          </h2>
          <p className="mt-4 text-dark-400 max-w-xl mx-auto leading-relaxed">
            Ada project menarik? Mau kolaborasi? Atau sekedar ngobrol soal tech?
            Jangan ragu buat reach out — aku selalu happy buat ngobrol.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact links */}
          <div className="space-y-4">
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 card-dark rounded-xl hover:border-blood-900 group transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-blood-950 border border-blood-900 flex items-center justify-center shrink-0 group-hover:bg-blood-900 transition-colors">
                  <Icon size={18} className="text-blood-400" />
                </div>
                <div>
                  <p className="text-xs text-dark-500 font-mono">{label}</p>
                  <p className="text-sm text-dark-200 group-hover:text-blood-400 transition-colors">
                    {value}
                  </p>
                </div>
              </a>
            ))}

            <div className="flex items-center gap-4 p-4 card-dark rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-blood-950 border border-blood-900 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-blood-400" />
              </div>
              <div>
                <p className="text-xs text-dark-500 font-mono">Location</p>
                <p className="text-sm text-dark-200">Indonesia 🇮🇩</p>
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
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-mono text-dark-500 mb-1.5"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Your name"
          className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-800 text-dark-200 placeholder-dark-600 text-sm focus:outline-none focus:border-blood-700 transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-mono text-dark-500 mb-1.5"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-800 text-dark-200 placeholder-dark-600 text-sm focus:outline-none focus:border-blood-700 transition-colors"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-xs font-mono text-dark-500 mb-1.5"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Hei, aku mau ngobrol soal..."
          className="w-full px-4 py-2.5 rounded-lg bg-dark-900 border border-dark-800 text-dark-200 placeholder-dark-600 text-sm focus:outline-none focus:border-blood-700 transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-blood-700 hover:bg-blood-600 text-white font-medium text-sm transition-colors hover:shadow-lg hover:shadow-blood-900/40"
      >
        Kirim Pesan
      </button>
    </form>
  );
}
