import {directus} from '@/lib/directus';
import {readItems} from '@directus/sdk';

export async function getAbout2() {
	return directus.request(readItems('about_2'));
}