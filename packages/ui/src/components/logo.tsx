import React, { forwardRef } from "react";

interface LogoProps extends React.SVGAttributes<SVGSVGElement> {
  LinkComp?: React.ElementType;
}

export const Logo = forwardRef<SVGSVGElement, LogoProps>(
  (
    { className = "", LinkComp = (props) => <a {...props} />, height = 80, width, fill = "var(--color-foreground)", ...props },
    ref
  ) => {
    return (
      <LinkComp href="/" className={`relative block ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width}
          height={height}
          viewBox="0 0 667 341"
          fill={fill}
          ref={ref}
          {...props}>
          <g id="logo">
            <g id="Z">
              <path
                id="Vector 6"
                d="M620.028 55.5853H433.076L400.816 111.462H587.769L620.028 55.5853Z"
              />
              <path
                id="Vector 7"
                d="M611.099 230.052H424.145L391.885 285.929H578.84L611.099 230.052Z"
              />
              <path
                id="accent"
                d="M569.627 142.854H474.485L442.252 198.695L537.368 198.695L569.627 142.854Z"
                fill="var(--color-accent)"
              />
            </g>
            <g id="A">
              <path
                id="Vector 1"
                d="M266.245 55.5853H188.452L55.4851 285.929H133.238L266.245 55.5853Z"
              />
              <path
                id="Vector 9"
                d="M218.398 230.052L324.211 230.052L356.444 285.893H250.657L218.398 230.052Z"
              />
            </g>
            <path
              id="dash"
              d="M439.532 142.819H251.393L219.115 198.695H407.273L439.532 142.819Z"
            />
            <circle
              id="Ellipse 1"
              cx="335.352"
              cy="91.5853"
              r="36"
            />
          </g>
        </svg>
      </LinkComp>
    );
  }
);

Logo.displayName = "Logo";
