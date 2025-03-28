declare global {
    interface Window {
        env: IEnv;
    }
}

interface IEnv {
    USE_MSW: string;
    APP_ENV: string;
    BASE_PATH: string;
    NAIS_CLUSTER_NAME: string;
    IS_LOCALHOST: string;
}

export function getEnv(value: keyof IEnv) {
    const env = typeof window !== "undefined" ? window.env : process.env;

    return env[value] || "";
}
