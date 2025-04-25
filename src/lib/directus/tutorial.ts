import {directus} from '@/lib/directus';
import {readItems} from '@directus/sdk';

export async function getTutorial() {
    return directus.request(readItems('tutorial'));
}