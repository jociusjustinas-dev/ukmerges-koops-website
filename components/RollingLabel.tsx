import { AvenirButtonArrow } from "../app/byq-icons";

export function RollingLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="avenir-button-inner">
      <span className="avenir-icon-wrap" aria-hidden="true">
        <span className="avenir-button-icon"><AvenirButtonArrow /></span>
      </span>
      <span className="avenir-button-text">{children}</span>
    </span>
  );
}
