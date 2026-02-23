import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BoardData, Card, Column } from '../types/kanban';
import { initialData } from '../data/initialData';

/**
 * Defines the possible states for the application's global modal system.
 * Used for creating, editing, and deleting cards or columns.
 */
export type ModalState =
    | { type: 'closed' }
    | { type: 'add-card'; columnId: string }
    | { type: 'edit-card'; card: Card }
    | { type: 'confirm-delete-card'; cardId: string; cardTitle: string }
    | { type: 'confirm-delete-column'; columnId: string; columnTitle: string };

interface KanbanState {
    data: BoardData;
    searchQuery: string;
    modalState: ModalState;
}

const initialState: KanbanState = {
    data: initialData,
    searchQuery: '',
    modalState: { type: 'closed' },
};

/**
 * Redux slice for managing the Kanban board state.
 * Handles tasks (cards), columns, searching, and modal visibility.
 */
const kanbanSlice = createSlice({
    name: 'kanban',
    initialState,
    reducers: {
        // Updates the search query used to filtered cards by title
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },
        // Modal management actions
        openAddCardModal: (state, action: PayloadAction<string>) => {
            state.modalState = { type: 'add-card', columnId: action.payload };
        },
        openEditCardModal: (state, action: PayloadAction<Card>) => {
            state.modalState = { type: 'edit-card', card: action.payload };
        },
        openConfirmDeleteCard: (state, action: PayloadAction<{ cardId: string; cardTitle: string }>) => {
            state.modalState = { type: 'confirm-delete-card', ...action.payload };
        },
        openConfirmDeleteColumn: (state, action: PayloadAction<{ columnId: string; columnTitle: string }>) => {
            state.modalState = { type: 'confirm-delete-column', ...action.payload };
        },
        closeModal: (state) => {
            state.modalState = { type: 'closed' };
        },
        // CRUD actions for cards
        addCard: (state, action: PayloadAction<{ columnId: string; cardData: { title: string; description: string } }>) => {
            const { columnId, cardData } = action.payload;
            const id = `card-${Date.now()}`;
            const newCard: Card = { id, title: cardData.title, description: cardData.description, status: columnId };
            state.data.cards[id] = newCard;
            state.data.columns[columnId].cardIds.unshift(id);
            state.modalState = { type: 'closed' };
        },
        updateCard: (state, action: PayloadAction<{ cardId: string; updates: { title: string; description: string } }>) => {
            const { cardId, updates } = action.payload;
            state.data.cards[cardId] = { ...state.data.cards[cardId], ...updates };
            state.modalState = { type: 'closed' };
        },
        deleteCard: (state, action: PayloadAction<string>) => {
            const cardId = action.payload;
            delete state.data.cards[cardId];
            Object.values(state.data.columns).forEach((col) => {
                col.cardIds = col.cardIds.filter((id) => id !== cardId);
            });
            state.modalState = { type: 'closed' };
        },
        // Handles moving a card within a column or between columns (Drag and Drop)
        moveCard: (state, action: PayloadAction<{
            cardId: string;
            sourceColId: string;
            destColId: string;
            sourceIndex: number;
            destIndex: number;
        }>) => {
            const { cardId, sourceColId, destColId, sourceIndex, destIndex } = action.payload;

            // Remove from source
            state.data.columns[sourceColId].cardIds.splice(sourceIndex, 1);

            // Add to destination
            state.data.columns[destColId].cardIds.splice(destIndex, 0, cardId);

            // Update card status if it moved to a different column
            if (sourceColId !== destColId) {
                state.data.cards[cardId].status = destColId;
            }
        },
        // CRUD actions for columns
        deleteColumn: (state, action: PayloadAction<string>) => {
            const columnId = action.payload;
            const col = state.data.columns[columnId];
            col.cardIds.forEach((id) => delete state.data.cards[id]);
            delete state.data.columns[columnId];
            state.data.columnOrder = state.data.columnOrder.filter((id) => id !== columnId);
            state.modalState = { type: 'closed' };
        },
        // Updates the entire board data (typically from React Query fetch)
        setBoardData: (state, action: PayloadAction<BoardData>) => {
            state.data = action.payload;
        }
    },
});

export const {
    setSearchQuery,
    openAddCardModal,
    openEditCardModal,
    openConfirmDeleteCard,
    openConfirmDeleteColumn,
    closeModal,
    addCard,
    updateCard,
    deleteCard,
    moveCard,
    deleteColumn,
    setBoardData,
} = kanbanSlice.actions;

export default kanbanSlice.reducer;
