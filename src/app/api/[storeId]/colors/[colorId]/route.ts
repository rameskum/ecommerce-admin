import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; colorId: string } }
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

		if (!params.colorId) {
			new NextResponse('Color Id is required', { status: 400 });
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

		const color = await prismadb.color.updateMany({
			where: {
				id: params.colorId,
				storeId: params.storeId,
			},
			data: {
				name,
				value,
			},
		});

		return NextResponse.json(color);
	} catch (e) {
		console.error('[COLOR_PATCH]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; colorId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.storeId) {
			new NextResponse('Store Id is required', { status: 400 });
		}

		if (!params.colorId) {
			new NextResponse('Color Id is required', { status: 400 });
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

		const color = await prismadb.color.deleteMany({
			where: {
				id: params.colorId,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(color);
	} catch (e) {
		console.error('[COLOR_DELETE]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	_req: Request,
	{ params }: { params: { colorId: string } }
) {
	try {
		if (!params.colorId) {
			new NextResponse('Color Id is required', { status: 400 });
		}

		const color = await prismadb.color.findUnique({
			where: {
				id: params.colorId,
			},
		});

		return NextResponse.json(color);
	} catch (e) {
		console.error('[COLOR_GET]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
