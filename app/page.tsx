import { HomePage } from "../components/HomePage";
import { getCmsPageView } from "../lib/cms-render";
import { getKoopsCmsData } from "../lib/wordpress";

export default async function Home() {
  const cms = await getKoopsCmsData();
  const { context, sections } = getCmsPageView(cms, "pradinis");

  return <HomePage context={context} sections={sections} />;
}
