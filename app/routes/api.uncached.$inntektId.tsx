import {hentUncachedInntekt} from "~/models/inntekt.server";
import type { Route } from "./+types/api.uncached.$inntektId";

export async function loader({ request, params }: Route.LoaderArgs) {
    if (!params.inntektId) {
        return new Response("Inntekt ID er tom", {
            status: 404,
            headers: { "Content-Type": "application/text" },
        });
    }

    const response = await hentUncachedInntekt(request, params.inntektId);

    if (response.ok) {
        const uncachedInntekt = await response.json();

        return new Response(JSON.stringify(uncachedInntekt), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }

    return new Response("Not found", {
        status: 404,
        headers: { "Content-Type": "application/text" },
    });
}
