import { Suspense } from "react";
import RedxContent from "./RedxContent";

export default function RedxTestPage() {
  return (
    <Suspense fallback={<p>Loading RedX areas...</p>}>
      <RedxContent />
    </Suspense>
  );
}