import { createDirectus, rest } from '@directus/sdk';

export const directus = createDirectus(`${process.env.NEXT_PUBLIC_API_URL_DIRECTUS}/`).with(rest());
