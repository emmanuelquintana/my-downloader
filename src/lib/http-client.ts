import { LoadingContextType } from "@/context/loading-context";

type FetchOptions = RequestInit & {
    showLoading?: boolean;
};

export const createHttpClient = (loadingContext: LoadingContextType) => {
    const { showLoading, hideLoading } = loadingContext;

    const get = async <T>(url: string, options: FetchOptions = {}): Promise<T> => {
        if (options.showLoading !== false) showLoading();

        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data as T;
        } finally {
            if (options.showLoading !== false) hideLoading();
        }
    };

    const post = async <T>(url: string, body: any, options: FetchOptions = {}): Promise<T> => {
        if (options.showLoading !== false) showLoading();


        const headers = new Headers(options.headers);
        if (!(body instanceof FormData)) {
            headers.set("Content-Type", "application/json");
        }

        try {
            const response = await fetch(url, {
                ...options,
                method: "POST",
                headers,
                body: body instanceof FormData ? body : JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return await response.json() as T;
            }

            return await response.blob() as unknown as T;

        } finally {
            if (options.showLoading !== false) hideLoading();
        }
    };

    return { get, post };
};
