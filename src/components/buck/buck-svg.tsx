import "./buck.css";

export type BuckPose = "walk" | "idle" | "happy" | "run" | "held" | "air";

/**
 * Buck desenhado em SVG (de perfil, olhando para a direita): pelo preto com reflexos
 * caramelo, focinho grisalho, orelha caída e felpuda e rabo peludo.
 */
export function BuckSvg({ pose = "idle", className }: { pose?: BuckPose; className?: string }) {
  return (
    <svg viewBox="0 0 220 150" className={`buck buck--${pose} ${className ?? ""}`} aria-hidden>
      <ellipse cx="108" cy="134" rx="58" ry="4.5" className="buck-shadow" />

      <g className="buck-bob">
        {/* Rabo */}
        <g className="buck-tail">
          <path
            d="M60 78 C44 78 28 68 24 52 q-6 -4 -2 -10 q-4 -6 2 -10 q0 -8 8 -8 q4 -6 10 -2 C36 34 40 50 52 58 q4 2 6 0 C60 66 64 72 70 72 Z"
            fill="#171615"
          />
          <g stroke="#e9e6df" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity=".3">
            <path d="M30 38 l6 6" />
            <path d="M32 52 l7 4" />
            <path d="M44 62 l6 2" />
          </g>
        </g>

        {/* Patas do lado de lá (mais escuras) */}
        <g className="buck-leg buck-leg--b">
          <rect x="62" y="94" width="12" height="34" rx="6" fill="#0c0c0b" />
          <ellipse cx="68" cy="128" rx="8" ry="4.5" fill="#bdb9b1" />
        </g>
        <g className="buck-leg buck-leg--a">
          <rect x="128" y="94" width="12" height="34" rx="6" fill="#0c0c0b" />
          <ellipse cx="134" cy="128" rx="8" ry="4.5" fill="#bdb9b1" />
        </g>

        {/* Corpo felpudo */}
        <path
          d="M50 84 C46 70 56 60 70 60 q4 -5 10 -2 q5 -5 11 -2 q5 -5 11 -2 q5 -5 11 -1 q6 -4 11 0 C140 54 154 62 156 78 C160 94 150 104 138 106 q-3 6 -9 2 q-4 7 -10 1 q-4 7 -10 1 q-4 7 -10 1 q-4 7 -10 1 q-4 7 -10 1 q-5 6 -10 0 C56 106 52 96 50 84 Z"
          fill="#1b1a19"
        />
        {/* Mechas tigradas */}
        <g stroke="#e9e6df" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity=".18">
          <path d="M68 72 l5 8" />
          <path d="M76 68 l4 9" />
          <path d="M96 66 l5 9" />
          <path d="M104 70 l4 8" />
          <path d="M122 66 l5 9" />
          <path d="M88 86 l4 8" />
          <path d="M112 86 l4 8" />
          <path d="M130 84 l4 7" />
        </g>
        {/* Pescoço */}
        <path d="M136 62 C150 62 160 74 156 94 L132 98 Z" fill="#1b1a19" />
        {/* Peito branco */}
        <path d="M140 86 q8 2 14 -2 q4 8 0 16 q-2 6 -6 8 q-2 -4 -5 -1 q-1 -5 -4 -4 q2 -8 1 -17 Z" fill="#f1efea" />

        {/* Patas do lado de cá */}
        <g className="buck-leg buck-leg--a">
          <rect x="72" y="96" width="13" height="33" rx="6.5" fill="#1b1a19" />
          <ellipse cx="78.5" cy="129" rx="8.5" ry="4.5" fill="#f1efea" />
        </g>
        <g className="buck-leg buck-leg--b">
          <rect x="138" y="96" width="13" height="33" rx="6.5" fill="#1b1a19" />
          <ellipse cx="144.5" cy="129" rx="8.5" ry="4.5" fill="#f1efea" />
        </g>

        {/* Cabeça */}
        <g className="buck-head">
          <g transform="translate(150 70) scale(1.1) translate(-150 -70)">
          <path
            d="M144 58 C142 42 156 34 170 36 C182 38 190 46 190 56 L204 62 C208 66 206 76 198 79 L180 80 C168 84 150 78 146 68 Z"
            fill="#1b1a19"
          />
          {/* Focinho grisalho */}
          <path d="M184 60 L203 64 C207 68 205 76 198 78 L182 79 C178 72 179 64 184 60 Z" fill="#8f8a84" />
          <ellipse cx="186" cy="74" rx="10" ry="6" fill="#7d7872" opacity=".7" />
          {/* Nariz */}
          <ellipse cx="203.5" cy="65.5" rx="5" ry="4" fill="#0d0d0d" />
          <ellipse cx="202" cy="64" rx="1.6" ry="1" fill="#fff" opacity=".5" />
          {/* Boca e língua */}
          <path d="M200 74 q-6 5 -14 3" stroke="#2a2522" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path className="buck-tongue" d="M190 77 q2 10 7 9 q4 -1 3 -9 Z" fill="#e8738a" />
          {/* Sobrancelha caramelo */}
          <ellipse cx="173" cy="47" rx="3.6" ry="2" fill="#d9d5cd" opacity=".55" />
          {/* Olho */}
          <g className="buck-eye">
            <circle cx="175" cy="55" r="5.2" fill="#2a211b" />
            <circle cx="175.5" cy="55" r="4" fill="#0f0c0a" />
            <circle cx="177" cy="53.4" r="1.4" fill="#fff" />
          </g>
          {/* Orelha caída e felpuda */}
          <g className="buck-ear">
            <path
              d="M160 40 C146 36 138 48 138 62 C137 72 139 82 144 90 q3 -4 5 1 q3 -5 6 0 q3 -5 6 -1 C162 78 166 58 160 40 Z"
              fill="#121110"
            />
            {/* Franja branca felpuda na ponta da orelha (lado lulu) */}
            <path
              d="M139 70 q4 6 10 7 q7 1 12 -4 q1 7 -1 13 q-2 -2 -4 1 q-2 -3 -5 0 q-2 -4 -5 -1 q-3 -4 -5 0 q-2 -7 -2 -16 Z"
              fill="#ece9e3"
              opacity=".92"
            />
            <g stroke="#e9e6df" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".35">
              <path d="M148 52 l-2 12" />
              <path d="M154 58 l-1 14" />
            </g>
          </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
