'use client';

import React from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reduxStore';
import { setSearchQuery, setBoardData, moveCard } from '../store/kanbanSlice';
import { useBoardQuery } from '../store/useBoardQuery';
import KanbanColumn from './KanbanColumn';
import Modal from './Modal';

/**
 * Main Kanban Board component.
 * Responsible for fetching data, handling Drag and Drop, and layout.
 */
export default function KanbanBoard() {
    const dispatch = useDispatch();
    const { data, searchQuery } = useSelector((state: RootState) => state.kanban);
    const { data: remoteData, isLoading } = useBoardQuery();
    const [mounted, setMounted] = React.useState(false);

    // Ensure component is mounted before rendering DnD components to avoid hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Sync remote data from React Query to Redux store
    React.useEffect(() => {
        if (remoteData) {
            dispatch(setBoardData(remoteData));
        }
    }, [remoteData, dispatch]);

    /**
     * Handles the end of a drag operation.
     * Updates the Redux store with the new card position.
     */
    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        dispatch(moveCard({
            cardId: draggableId,
            sourceColId: source.droppableId,
            destColId: destination.droppableId,
            sourceIndex: source.index,
            destIndex: destination.index
        }));
    };

    if (!mounted || isLoading) {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    /**
     * Filters cards based on the search query.
     */
    const getFilteredCards = (columnId: string) => {
        const col = data.columns[columnId];
        if (!col) return [];
        return col.cardIds
            .map((id) => data.cards[id])
            .filter(Boolean)
            .filter((card) => !searchQuery ||
                card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' }}>
            <AppBar
                position="sticky"
                color="inherit"
                elevation={0}
                sx={{
                    borderBottom: '1px solid',
                    borderColor: 'rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(10px)',
                    bgcolor: 'rgba(255,255,255,0.8)',
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <Toolbar sx={{ gap: 2, flexWrap: 'nowrap', py: 1 }}>
                    <Typography
                        variant="h5"
                        fontWeight={800}
                        sx={{
                            flexGrow: 1,
                            color: 'primary.main',
                            letterSpacing: '-0.02em',
                            display: { xs: 'none', sm: 'block' }
                        }}
                    >
                        Kanban Board
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: 'rgba(0,0,0,0.04)',
                            borderRadius: '12px',
                            px: 2,
                            py: 0.75,
                            gap: 1.5,
                            transition: 'all 0.2s',
                            width: { xs: '100%', sm: '300px' },
                            '&:focus-within': {
                                bgcolor: '#fff',
                                boxShadow: '0 0 0 2px #111'
                            }
                        }}
                    >
                        <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        <InputBase
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                            sx={{ fontSize: 14, width: '100%', fontWeight: 500 }}
                        />
                    </Box>
                </Toolbar>
            </AppBar>

            <DragDropContext onDragEnd={onDragEnd}>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 3,
                        p: 4,
                        overflowX: 'auto',
                        minHeight: 'calc(100vh - 80px)',
                        alignItems: 'flex-start',
                        scrollBehavior: 'smooth',
                        '::-webkit-scrollbar': { height: 8 },
                        '::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: 4 },
                        '::-webkit-scrollbar-track': { bgcolor: 'transparent' }
                    }}
                >
                    {data.columnOrder.map((colId) => {
                        const column = data.columns[colId];
                        if (!column) return null;
                        return <KanbanColumn key={colId} column={column} cards={getFilteredCards(colId)} />;
                    })}
                </Box>
            </DragDropContext>

            <Modal />
        </Box>
    );
}
