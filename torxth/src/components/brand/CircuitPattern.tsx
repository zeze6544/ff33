export function CircuitPattern({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="#0070B0" strokeWidth="1.6" opacity="0.45">
        <path d="M40 80 H220 V160 H360" />
        <path d="M120 40 V200 H280 V320" />
        <path d="M400 60 H560 V140 H720" />
        <path d="M480 120 V280 H640" />
        <path d="M60 260 H200 V340 H340" />
        <path d="M520 300 H700 V360" />
        <path d="M300 40 H380 V100 H440" />
      </g>
      <g fill="#1A8FD0">
        <circle cx="40" cy="80" r="4" className="animate-node" />
        <circle cx="220" cy="80" r="4" />
        <circle cx="360" cy="160" r="4" className="animate-node" style={{ animationDelay: '0.6s' }} />
        <circle cx="120" cy="40" r="4" />
        <circle cx="280" cy="200" r="4" className="animate-node" style={{ animationDelay: '1.1s' }} />
        <circle cx="280" cy="320" r="4" />
        <circle cx="560" cy="60" r="4" />
        <circle cx="720" cy="140" r="4" className="animate-node" style={{ animationDelay: '0.3s' }} />
        <circle cx="640" cy="280" r="4" />
        <circle cx="200" cy="260" r="4" />
        <circle cx="340" cy="340" r="4" className="animate-node" style={{ animationDelay: '1.4s' }} />
        <circle cx="700" cy="300" r="4" />
        <circle cx="440" cy="100" r="4" />
      </g>
    </svg>
  )
}
