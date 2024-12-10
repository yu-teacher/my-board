import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { ApiClient } from '$lib/api/client';

export const load = (async ({ params, fetch }) => {
  try {
    const post = await ApiClient.getPost(Number(params.id), fetch);
    return { post };
  } catch (err) {
    throw error(404, '게시글을 찾을 수 없습니다.');
  }
}) satisfies PageLoad;