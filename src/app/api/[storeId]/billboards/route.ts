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
		const { label, imageUrl } = body;

		if (!label) {
			new NextResponse('Label is required', { status: 400 });
		}

		if (!imageUrl) {
			new NextResponse('Image url is required', { status: 400 });
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

		const billboard = await prismadb.billboard.create({
			data: {
				label,
				imageUrl,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(billboard);
	} catch (e) {
		console.error('[BILLBOARDS_POST]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const billboards = await prismadb.billboard.findMany({
			where: {
				storeId: params.storeId,
			},
		});

		return NextResponse.json(billboards);
	} catch (e) {
		console.error('[BILLBOARDS_GET]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
