import { createDirectus, rest } from '@directus/sdk';

export const directus = createDirectus("https://maximagoldhedging.com/").with(rest());
