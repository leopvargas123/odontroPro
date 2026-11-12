import { v2 as cloudinary, type UploadApiResponse } from 'cloudinary';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
    api_key: process.env.CLOUDINARY_API_KEY as string,
    api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

export const POST = async (request: Request) => {
    const session = await auth();

    if (!session?.user.id) {
        return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
        return NextResponse.json({ error: 'Selecione uma imagem para enviar.' }, { status: 400 });
    }

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        return NextResponse.json({ error: 'Formato de imagem inválido. Use JPEG ou PNG.' }, { status: 400 });
    }

    const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        console.error('As credenciais do Cloudinary não estão configuradas.');
        return NextResponse.json({ error: 'O serviço de imagens está indisponível.' }, { status: 500 });
    }

    cloudinary.config({
        cloud_name: CLOUDINARY_CLOUD_NAME,
        api_key: CLOUDINARY_API_KEY,
        api_secret: CLOUDINARY_API_SECRET,
    });

    try {
        const buffer = new Uint8Array(await file.arrayBuffer());
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'avatars',
                    public_id: session.user.id,
                    overwrite: true,
                    resource_type: 'image',
                },
                (error, uploadResult) => {
                    if (error) {
                        reject(error);
                        return;
                    }

                    if (!uploadResult) {
                        reject(new Error('O Cloudinary não retornou o resultado do upload.'));
                        return;
                    }

                    resolve(uploadResult);
                },
            ).end(buffer);
        });

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: result.secure_url },
        });

        return NextResponse.json({ url: result.secure_url });
    } catch (error) {
        console.error('Falha ao enviar ou salvar a imagem de perfil:', error);
        return NextResponse.json({ error: 'Não foi possível atualizar a imagem de perfil.' }, { status: 500 });
    }
};