import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export async function PATCH(
	req: Request,
	{ params }: { params: { storeId: string; productId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		const body = await req.json();
		const {
			name,
			price,
			categoryId,
			colorId,
			sizeId,
			images,
			isFeatured,
			isArchived,
		} = body;

		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}

		if (!price) {
			return new NextResponse('Price is required', { status: 400 });
		}

		if (!categoryId) {
			return new NextResponse('CategoryId is required', { status: 400 });
		}

		if (!colorId) {
			return new NextResponse('ColorId is required', { status: 400 });
		}

		if (!sizeId) {
			return new NextResponse('SizeId is required', { status: 400 });
		}

		if (!images || !images.length) {
			return new NextResponse('Images are required', { status: 400 });
		}

		if (!params.storeId) {
			new NextResponse('Store Id is required', { status: 400 });
		}

		if (!params.productId) {
			new NextResponse('Product Id is required', { status: 400 });
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

		await prismadb.product.update({
			where: {
				id: params.productId,
				storeId: params.storeId,
			},
			data: {
				name,
				price,
				isFeatured,
				isArchived,
				colorId,
				sizeId,
				categoryId,
				storeId: params.storeId,
				images: {
					deleteMany: {},
				},
			},
		});

		const product = await prismadb.product.update({
			where: {
				id: params.productId,
				storeId: params.storeId,
			},
			data: {
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
			},
		});

		return NextResponse.json(product);
	} catch (e) {
		console.error('[PRODUCT_PATCH]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: { storeId: string; productId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}

		if (!params.storeId) {
			new NextResponse('Store Id is required', { status: 400 });
		}

		if (!params.productId) {
			new NextResponse('Product Id is required', { status: 400 });
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

		const product = await prismadb.product.deleteMany({
			where: {
				id: params.productId,
				storeId: params.storeId,
			},
		});

		return NextResponse.json(product);
	} catch (e) {
		console.error('[PRODUCT_DELETE]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	_req: Request,
	{ params }: { params: { productId: string } }
) {
	try {
		if (!params.productId) {
			new NextResponse('Product Id is required', { status: 400 });
		}

		const product = await prismadb.product.findUnique({
			where: {
				id: params.productId,
			},
			include: {
				images: true,
				category: true,
				size: true,
				color: true,
			},
		});

		return NextResponse.json(product);
	} catch (e) {
		console.error('[PRODUCT_GET]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
