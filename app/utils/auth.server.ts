import {getToken, requestOboToken, validateToken} from "@navikt/oasis";
import {getEnv} from "~/utils/env.utils";

export async function getDPInntektOboToken(request: Request) {
    if (getEnv("IS_LOCALHOST") === "true") {
        return "";
    }
    const audience = `${getEnv("NAIS_CLUSTER_NAME")}:teamdagpenger:dp-inntekt-api`;
    return await getOnBehalfOfToken(request, audience);
}


export async function getOnBehalfOfToken(request: Request, audience: string): Promise<string> {
    const token = getToken(request);
    if (!token) {
        console.error("Missing token");

        throw new Error("Missing token");
    }

    const validation = await validateToken(token);
    if (!validation.ok) {
        console.error("Token validation failed!");

        throw new Error("Token validation failed!");
    }

    const onBehalfOfToken = await requestOboToken(token, audience);
    if (!onBehalfOfToken.ok) {
        console.error("onBehalfOfToken not found");
        throw Error("onBehalfOfToken not found");
    }

    return onBehalfOfToken.token;
}