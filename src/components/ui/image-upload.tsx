'use client';

import { ImagePlus, Trash } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

interface ImageUploadProps {
	disabled?: boolean;
	onChange: (value: string) => void;
	onRemove: (value: string) => void;
	values: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
	disabled = false,
	onChange,
	onRemove,
	values,
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const onUplaod = (result: any) => {
		onChange(result.info.secure_url);
	};

	if (!isMounted) return null;

	return (
		<div>
			<div className="mb-4 flex items-center gap-4">
				{values.map(url => (
					<div
						key={url}
						className="relative size-[200px] rounded-md overflow-hidden"
					>
						<div className="z-10 absolute top-2 right-2">
							<Button
								onClick={() => onRemove(url)}
								variant="destructive"
								size="icon"
							>
								<Trash className="size-4" />
							</Button>
						</div>
						<Image fill className="object-cover" alt="Image" src={url} />
					</div>
				))}
			</div>
			<CldUploadWidget onUpload={onUplaod} uploadPreset="hz5vr7sx">
				{({ open }) => {
					const onClick = () => {
						open();
					};

					return (
						<Button
							disabled={disabled}
							onClick={onClick}
							variant="secondary"
							type="button"
						>
							<ImagePlus className="size-4 mr-2" />
							Upload an Image
						</Button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUpload;
