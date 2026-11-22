import { connection } from "next/server";
import { getRedxAreas } from "../actions/redx";

export default async function RedxContent() {

  await connection();

  const areas = await getRedxAreas();

  return (
    <pre>
      {JSON.stringify(areas, null, 2)}
    </pre>
  );
}