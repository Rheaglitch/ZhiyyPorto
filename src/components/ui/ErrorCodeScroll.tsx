"use client";

import { useEffect, useRef } from "react";

// Fake error/code lines yang terus scroll ke atas
const ERROR_LINES = [
  "segmentation fault (core dumped)",
  "error: null pointer dereference",
  "FATAL: kernel panic - not syncing",
  "struct cpuhp_cpu_state *st",
  "enum cpuhp_state target;",
  "bool nofail) { if (ret)",
  "  goto out;",
  "static unsigned int cpu_state",
  "while (cpuhp_next_state(brin",
  "  int err;",
  "  primary_thread_mask(nid)",
  "  err = cpuhp_invoke_c",
  "  if (!err)",
  "    st->sta",
  "    ret = -1;",
  "  } else {",
  "    ret = err;",
  "  }",
  "cpus_write_unlock();",
  "unsigned int cpu_state = 0",
  "ack_range(bool bringup,",
  "  unsigned int cpu_to_node(cpu));",
  "  struct cpuhp_cpu_state *st,",
  "  enum cpuhp_state target)",
  "if (IS_ENABLED(CON",
  "  return true;",
  "back_range_nofail(bool bringup,",
  "  unsigned int cpu,",
  "  struct cpuhp_cpu_state *st,",
  "LOCKDEP_MAP_INIT(\"cpuhp",
  "return -EINVAL;",
  "allback(cpu, state, bringup, NULL, NULL);",
  "cpu_hotplug_disabled) {",
  "STATIC_KEY_FALSE(&cpu_hotplug",
  "void cpuhp_log_err(unsigned",
  "return st->state <= CPUHP_BRI",
  "err = cpuhp_invoke_callback",
  "if (cpu_hotplug_disabled) {",
  "  cpu_down(which takes cpu maps",
  "  struct cpuhp_cpu_state *st",
  "ADD_FAILED (%d) DOWN",
  "write_unlock();",
  "task_struct *p = NULL;",
  "nux/sched/mm.h",
  "nux/sched/signal.h",
  "offline() because SHE",
  "state = min((int)target,",
  "state)->name,",
  "responsible for bringup NUL",
  "CPUHP_BRINGUP_CPU: After that",
  "return ret;",
];

export function ErrorCodeScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const posRef       = useRef(0);
  const rafRef       = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Speed: px per frame
    const speed = 0.6;

    const animate = () => {
      posRef.current -= speed;
      // Reset when scrolled past half (content is duplicated)
      const halfH = container.scrollHeight / 2;
      if (Math.abs(posRef.current) >= halfH) {
        posRef.current = 0;
      }
      container.style.transform = `translateY(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const doubled = [...ERROR_LINES, ...ERROR_LINES];

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-[2]"
      style={{
        right: 0,
        left: "auto",
        width: "52%",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
      aria-hidden="true"
    >
      <div
        ref={containerRef}
        className="flex flex-col gap-0"
        style={{ willChange: "transform", paddingTop: "20px" }}
      >
        {doubled.map((line, i) => {
          // Randomize brightness slightly for depth
          const opacity  = 0.08 + (i % 7) * 0.025;
          const isRed    = i % 11 === 0;
          const isBright = i % 17 === 0;
          return (
            <div
              key={i}
              className="font-mono leading-relaxed select-none"
              style={{
                fontSize:    "10px",
                color:       isRed ? `rgba(200,40,40,${opacity * 2.5})` :
                             isBright ? `rgba(200,180,180,${opacity * 2})` :
                             `rgba(160,120,120,${opacity})`,
                paddingLeft: `${(i % 4) * 18}px`,
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>
    </div>
  );
}
