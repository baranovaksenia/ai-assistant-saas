import prismadb from '@/lib/prismadb';
import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { companionId: string } }) {
	try {
		const body = await req.json();
		const user = await currentUser()
		const { src, name, description, instructions, seed, categoryId } = body;

		if (!params.companionId) {
			return new NextResponse("Missing companionId", { status: 400 })
		}

		if (!user || !user.id || !user.firstName) {
			return new NextResponse("Unauthorized", { status: 401 })
		}
		if (!src || !name || !description || !instructions || !seed || !categoryId) {
			return new NextResponse("Missing required fields", { status: 400 })
		}

		// todo: check for subscription
		// create new companion
		const companion = await prismadb.companion.update({
			where: {
				id: params.companionId,
				userId: user.id
			},
			data: {
				categoryId,
				userId: user.id,
				userName: user.firstName,
				src,
				name,
				description,
				instructions,
				seed,
			}
		});
		// return to client object with new companion
		return NextResponse.json(companion)

	} catch (error) {
		console.log("[COMPANION_PATCH_ERROR]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}

export async function DELETE(req: Request, { params }: { params: { companionId: string } }) {
	try {
		const { userId } = auth()
		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 })
		}

		// delete companion can only his owner
		const companion = await prismadb.companion.delete({
			where: {
				userId: userId,
				id: params.companionId
			}
		})
		// return deleted companion
		return NextResponse.json(companion)

	} catch (error) {
		console.log("[COMPANION_DELETE]", error)
		return new NextResponse("Internal Error", { status: 500 })
	}
}