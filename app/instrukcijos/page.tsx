import { createPageMetadata } from "../../lib/metadata";
import { TvsGuide } from "../../components/TvsGuide";

export const metadata = createPageMetadata({
  title: "KOOPS | Kaip naudotis TVS",
  description: "Vidaus vadovas, kaip valdyti KOOPS svetainės turinį per WordPress.",
  path: "/instrukcijos",
  noIndex: true,
});

export default function InstrukcijosPage() {
  return <TvsGuide />;
}
