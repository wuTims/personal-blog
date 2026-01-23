import { useMemo } from 'react'

interface CSSSnowfallProps {
  snowflakeCount?: number
}

/**
 * CSS-based snowfall effect for iOS Safari compatibility.
 * Uses pure CSS animations instead of canvas to avoid GPU crashes.
 */
export function CSSSnowfall({ snowflakeCount = 50 }: CSSSnowfallProps) {
  const snowflakes = useMemo(() => {
    return Array.from({ length: snowflakeCount }, (_, i) => {
      const size = Math.random() * 4 + 2 // 2-6px
      const left = Math.random() * 100 // 0-100%
      const animationDuration = Math.random() * 5 + 5 // 5-10s
      const animationDelay = Math.random() * 5 // 0-5s
      const opacity = Math.random() * 0.6 + 0.4 // 0.4-1

      return {
        id: i,
        size,
        left,
        animationDuration,
        animationDelay,
        opacity,
      }
    })
  }, [snowflakeCount])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <style>
        {`
          @keyframes snowfall {
            0% {
              transform: translateY(-10px) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0;
            }
          }
          @keyframes sway {
            0%, 100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(20px);
            }
          }
        `}
      </style>
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={{
            width: flake.size,
            height: flake.size,
            left: `${flake.left}%`,
            top: -10,
            opacity: flake.opacity,
            animation: `snowfall ${flake.animationDuration}s linear ${flake.animationDelay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
