import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
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

		if (!params.billboardId) {
			new NextResponse('Billboard Id is required', { status: 400 });
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

		const billboard = await prismadb.billboard.updateMany({
			where: {
				id: params.billboardId,
				storeId: params.storeId,
			},
			data: {
				label,
				imageUrl,
			},
		});

		return NextResponse.json(billboard);
	} catch (e) {
		console.error('[BILLBOARD_PATCH]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; billboardId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.storeId) {
			new NextResponse('Store Id is required', { status: 400 });
		}

		if (!params.billboardId) {
			new NextResponse('Billboard Id is required', { status: 400 });
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

		const billboard = await prismadb.billboard.deleteMany({
			where: {
				id: params.billboardId,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(billboard);
	} catch (e) {
		console.error('[BILLBOARD_DELETE]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	_req: Request,
	{ params }: { params: { billboardId: string } }
) {
	try {
		if (!params.billboardId) {
			new NextResponse('Billboard Id is required', { status: 400 });
		}

		const billboard = await prismadb.billboard.findUnique({
			where: {
				id: params.billboardId,
			},
		});

		return NextResponse.json(billboard);
	} catch (e) {
		console.error('[BILLBOARD_GET]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
