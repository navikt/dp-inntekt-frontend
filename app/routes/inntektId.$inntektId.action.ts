import { redirect } from "react-router";
import { lagreInntekt } from "~/models/inntekt.server";
import type { Route } from "./+types/_index";

// Lagring av inntekten
// Denne funksjonen håndterer lagring av inntekten når brukeren sender inn skjemaet
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const entries = Object.fromEntries(formData.entries());
  const inntektId = entries["inntektId"] as string;
  const payload = entries["payload"] as string;

  console.log(`🔥 inntektId :`, inntektId);
  console.log(`🔥 payload :`, payload);

  const lagreInntektResponse = await lagreInntekt(request, inntektId, payload);

  if (!lagreInntektResponse.ok) {
    throw new Response("Feil ved lagring av inntekt", {
      status: lagreInntektResponse.status,
      statusText: lagreInntektResponse.statusText,
    });
  }

  const nyInntektId = await lagreInntektResponse.text();
  console.log(`🔥 nyInntektId :`, nyInntektId);

  return redirect(`/inntektId/${nyInntektId}`);
}
