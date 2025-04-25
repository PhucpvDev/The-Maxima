import {directus} from '@/lib/directus';
import {readItems} from '@directus/sdk';

export async function getClientSay() {
    return directus.request(readItems('client_say'));
}