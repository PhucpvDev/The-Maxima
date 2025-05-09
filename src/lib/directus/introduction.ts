import {directus} from '@/lib/directus';
import {readItems} from '@directus/sdk';

export async function getIntroduction() {
    return directus.request(readItems('introduction'));
}