import { getRedxAreas } from "../actions/redx";

export default async function RedxTestPage() {
  const areas = await getRedxAreas();

  return (
    <pre>
      {JSON.stringify(areas, null, 2)}
    </pre>
  );
}