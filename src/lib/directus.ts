import { createDirectus, rest } from '@directus/sdk';

export const directus = createDirectus("https://the-maxima.directus.app/").with(rest());
