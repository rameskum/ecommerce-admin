import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}
		const body = await req.json();
		const { name, value } = body;

		if (!name) {
			new NextResponse('Name is required', { status: 400 });
		}

		if (!value) {
			new NextResponse('Value is required', { status: 400 });
		}

		if (!params.storeId) {
			new NextResponse('Store Id is required', { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				userId: userId,
				id: params.storeId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		const size = await prismadb.size.create({
			data: {
				name,
				value,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(size);
	} catch (e) {
		console.error('[SIZES_POST]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const sizes = await prismadb.size.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(sizes);
	} catch (e) {
		console.error('[SIZES_GET]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
