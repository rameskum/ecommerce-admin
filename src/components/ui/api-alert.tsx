'use client';

import { Copy, Server } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

interface ApiAlertProps {
	title: string;
	description: string;
	varient: 'public' | 'admin';
}

const textMap: Record<ApiAlertProps['varient'], string> = {
	public: 'Public',
	admin: 'Admin',
};

const variantMap: Record<ApiAlertProps['varient'], BadgeProps['variant']> = {
	public: 'secondary',
	admin: 'destructive',
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
	title,
	description,
	varient,
}) => {
	const onCopy = () => {
		navigator.clipboard.writeText(description);
		toast.success('API Route copied to the clipboard');
	};

	return (
		<Alert>
			<Server className="h-4 w-4" />
			<AlertTitle className="flex items-center gap-x-2">
				{title}
				<Badge variant={variantMap[varient]}>{textMap[varient]}</Badge>
			</AlertTitle>
			<AlertDescription className="mt-4 flex items-center justify-between">
				<code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-sm font-semibold ">
					{description}
				</code>
				<Button size="icon" variant="outline" onClick={onCopy}>
					<Copy className="size-4" />
				</Button>
			</AlertDescription>
		</Alert>
	);
};
