import { create } from 'zustand';

interface useStateModalStore {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export const useStoreModal = create<useStateModalStore>(set => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));
