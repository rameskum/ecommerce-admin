import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}
		const body = await req.json();

		const { name } = body;
		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}

		if (!params.storeId) {
			return new NextResponse('Store ID is required', { status: 400 });
		}
		const store = await prismadb.store.updateMany({
			where: {
				id: params.storeId,
				userId: userId,
			},
			data: {
				name,
			},
		});

		return NextResponse.json(store);
	} catch (e) {
		console.error('[STORE_PATCH]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthorized', { status: 401 });
		}

		if (!params.storeId) {
			return new NextResponse('Store ID is required', { status: 400 });
		}
		const store = await prismadb.store.deleteMany({
			where: {
				id: params.storeId,
				userId: userId,
			},
		});

		return NextResponse.json(store);
	} catch (e) {
		console.error('[STORE_DELETE]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
