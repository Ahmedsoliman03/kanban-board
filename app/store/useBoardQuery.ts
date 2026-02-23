import { useQuery } from '@tanstack/react-query';
import { initialData } from '../data/initialData';
import { BoardData } from '../types/kanban';

/**
 * Mocks an API call to fetch the initial board data.
 * Returns a promise that resolves with the static initialData after a short delay.
 */
const fetchBoardData = async (): Promise<BoardData> => {
    // Simulate network delay to demonstrate loading state
    await new Promise((resolve) => setTimeout(resolve, 800));
    return initialData;
};

/**
 * Custom hook to manage board data fetching and caching using React Query.
 */
export const useBoardQuery = () => {
    return useQuery({
        queryKey: ['boardData'],
        queryFn: fetchBoardData,
        staleTime: Infinity, // Keep data indefinitely as updates are managed in Redux
    });
};
