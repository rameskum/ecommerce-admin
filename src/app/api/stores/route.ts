import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export async function POST(req: Request) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		const body = await req.json();
		const { name } = body;
		if (!name) {
			new NextResponse('Name is required', { status: 400 });
		}

		const store = await prismadb.store.create({
			data: {
				name,
				userId,
			},
		});

		return NextResponse.json(store);
	} catch (e) {
		console.error('[STORES_POST]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
