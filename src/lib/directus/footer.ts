export interface FooterTranslation {
    id: number;
    footer_id: number;
    languages_code: string;
    description: string;
    title_lang: string;
}

export interface RawFooterData {
    id: number;
    status: string;
    description: string;
    title_lang: string;
    translations: FooterTranslation[];
}

export interface TransformedFooterData {
    id: number;
    status: string;
    description: string;
    title_lang: string;
}

function transformFooterData(data: RawFooterData, locale: string): TransformedFooterData {
    const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
    const translation = data.translations.find((t) => t.languages_code === lang);

    const source = translation || data;

    return {
        id: data.id,
        status: data.status,
        description: source.description || "© 2025 The Maxima Experience. All rights reserved",
        title_lang: source.title_lang || "Language:",
    };
}

export async function getFooter(locale: string): Promise<TransformedFooterData> {
    try {
        const lang = locale === "vi" ? "vi-VN" : locale === "zh" ? "zh-CN" : "en-US";
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/items/footer?lang=${lang}&fields=*,translations.*`,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch footer data");
        }

        const result = await response.json();
        const rawData: RawFooterData = Array.isArray(result.data) ? result.data[0] : result.data;

        return transformFooterData(rawData, locale);
    } catch (error) {
        console.error("Error fetching footer data:", error);
        return {
            id: 1,
            status: "draft",
            description: "© 2025 The Maxima Experience. All rights reserved",
            title_lang: "Language:",
        };
    }
}