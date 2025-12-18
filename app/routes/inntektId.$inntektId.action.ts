import { redirect } from "react-router";
import type { Route } from "./+types/_index";
import { lagreInntekt } from "~/models/inntekt.server";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const entries = Object.fromEntries(formData.entries());
  const inntektId = entries["inntektId"] as string;
  const behandlingId = entries["behandlingId"] as string;
  const opplysningId = entries["opplysningId"] as string;
  const payload = entries["payload"] as string;

  const lagreInntektResponse = await lagreInntekt(
    request,
    inntektId,
    behandlingId,
    opplysningId,
    payload
  );

  if (!lagreInntektResponse.ok) {
    throw new Response("Feil ved lagring av inntekt", {
      status: lagreInntektResponse.status,
      statusText: lagreInntektResponse.statusText,
    });
  }

  const nyInntektId = await lagreInntektResponse.text();

  return redirect(
    `/inntektId/${nyInntektId}?behandlingId=${behandlingId}&opplysningId=${opplysningId}`
  );
}
