import { recenteBesluiten, wetVanDeWeek } from "@/lib/tk";
import HomeScherm from "@/components/HomeScherm";

export const revalidate = 3600;

export default async function Home() {
  const { besluiten, ok } = await recenteBesluiten(14);
  const wet = wetVanDeWeek(besluiten);

  return (
    <HomeScherm
      ok={ok}
      totaal={besluiten.length}
      aangenomen={besluiten.filter((b) => b.uitslag === "aangenomen").length}
      titels={besluiten.map((b) => b.titel)}
      wet={wet ? { id: wet.id, titel: wet.titel } : null}
    />
  );
}
