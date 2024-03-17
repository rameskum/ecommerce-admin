import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		const body = await req.json();
		const { name, billboardId } = body;

		if (!name) {
			new NextResponse('Name is required', { status: 400 });
		}

		if (!billboardId) {
			new NextResponse('Billboard Id is required', { status: 400 });
		}

		if (!params.storeId) {
			new NextResponse('Store Id is required', { status: 400 });
		}

		if (!params.categoryId) {
			new NextResponse('Category Id is required', { status: 400 });
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

		const category = await prismadb.category.updateMany({
			where: {
				id: params.categoryId,
				storeId: params.storeId,
			},
			data: {
				name,
				billboardId,
			},
		});

		return NextResponse.json(category);
	} catch (e) {
		console.error('[CATEGORY_PATCH]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; categoryId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.storeId) {
			new NextResponse('Store Id is required', { status: 400 });
		}

		if (!params.categoryId) {
			new NextResponse('Category Id is required', { status: 400 });
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

		const category = await prismadb.category.deleteMany({
			where: {
				id: params.categoryId,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(category);
	} catch (e) {
		console.error('[CATEGORY_DELETE]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	_req: Request,
	{ params }: { params: { categoryId: string } }
) {
	try {
		if (!params.categoryId) {
			new NextResponse('Category Id is required', { status: 400 });
		}

		const category = await prismadb.category.findUnique({
			where: {
				id: params.categoryId,
			},
			include: {
				billboard: true,
			},
		});

		return NextResponse.json(category);
	} catch (e) {
		console.error('[CATEGORY_GET]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
