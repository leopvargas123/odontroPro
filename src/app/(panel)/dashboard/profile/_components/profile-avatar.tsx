 'use client';

import Image from 'next/image';
import {useState} from 'react';
import semFoto from '../../../../../../public/foto1.png';
import { Loader, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { updateProfileAvatar } from '../_actions/update-avatar';
import { useSession } from 'next-auth/react';


 interface AvatarProfileProps {
     avatarUrl: string | null;
  }
 
  export function AvatarProfile({avatarUrl}: AvatarProfileProps) {
     const [previewImage, setPreviewImage] = useState(avatarUrl);
     const [loading, setLoading] = useState(false);

     const {update} = useSession();

     async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
         const image = e.target.files?.[0];
         if (!image) {
             return;
         }

         if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
             toast.error('Formato de imagem inválido. Por favor, selecione uma imagem JPEG ou PNG.');
             e.target.value = '';
             return;
         }

         setLoading(true);
         const input = e.target;

         try {
             const formData = new FormData();
             formData.append('file', image);

             const response = await fetch('/api/image/upload', {
                 method: 'POST',
                 body: formData,
             });
             const data: { url?: unknown; error?: unknown } = await response.json();

             if (!response.ok) {
                 throw new Error(typeof data.error === 'string' ? data.error : 'Erro ao enviar a imagem.');
             }
             if (typeof data.url !== 'string') {
                 throw new Error('O servidor não retornou a URL da imagem.');
             }

             setPreviewImage(data.url);

             await updateProfileAvatar({ avatarUrl: data.url });
             await update({
                image: data.url,
             });


             setLoading(false);


             toast.success('Imagem enviada com sucesso!');
         } catch (error) {
             toast.error(error instanceof Error ? error.message : 'Erro ao fazer upload da imagem.');
         } finally {
             setLoading(false);
             input.value = '';
         }
     }

    return (
        <div className='relative w-40 h-40 md:w-48 md:h-48'> 

            <div className='relative flex items-center justify-center w-full h-full'>
                <span className='absolute cursor-pointer z-2 bg-slate-50/80 p-2 rounded-full shadow-xl  '>
                    { loading ? (
                        <Loader size={16}  color='#131313' className='animate-spin' />
                    ): 
                    (
                       <Upload size={16} color='#131313' /> 
                    )}
                </span>
            <input
            type='file'
            className='opacity-0 cursor-pointer relative z-50 w-48 h-48'
            onChange={handleChange}
            />
            </div>

            {previewImage ? (
                <Image
                src={previewImage}
                alt='Profile Avatar'
                fill
                className='rounded-full object-cover w-full h-48 bg-slate-200'
                quality={100}
                priority
                sizes='(max-width> 480px) 100vw, (max-width: 1024px) 75vw, 60vw'

                />
            ):
             <Image
                src={semFoto}
                alt='Profile Avatar'
                fill
                className='rounded-full object-cover w-full h-48 bg-slate-200'
                quality={100}
                priority
                sizes='(max-width> 480px) 100vw, (max-width: 1024px) 75vw, 60vw'

                /> } 
        </div>
    )
 }