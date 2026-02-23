'use client';

import React from 'react';
import { Box, Typography, Chip, IconButton, Tooltip, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Droppable } from '@hello-pangea/dnd';
import { useDispatch } from 'react-redux';
import { Column, Card } from '../types/kanban';
import { openAddCardModal, openConfirmDeleteColumn } from '../store/kanbanSlice';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
    column: Column;
    cards: Card[];
}

/**
 * Column component that lists tasks.
 * Includes pagination logic and acts as a Droppable zone for cards.
 */
export default function KanbanColumn({ column, cards }: KanbanColumnProps) {
    const dispatch = useDispatch();

    // Pagination state: number of items to show
    const [page, setPage] = React.useState(1);
    const ITEMS_PER_PAGE = 3;
    const paginatedCards = cards.slice(0, page * ITEMS_PER_PAGE);
    const hasMore = cards.length > paginatedCards.length;

    return (
        <Box sx={{ flexShrink: 0, width: 300, display: 'flex', flexDirection: 'column' }}>
            {/* Column Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                    mb: 2,
                    borderRadius: '16px',
                    bgcolor: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(4px)',
                    border: '1px solid rgba(0,0,0,0.04)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ letterSpacing: '-0.01em' }}>
                        {column.title}
                    </Typography>
                    <Chip
                        label={cards.length}
                        size="small"
                        sx={{
                            height: 20,
                            minWidth: 20,
                            fontSize: 10,
                            fontWeight: 800,
                            bgcolor: 'primary.main',
                            color: '#fff',
                            borderRadius: '6px'
                        }}
                    />
                </Box>
                <Tooltip title="Delete Column">
                    <IconButton
                        size="small"
                        onClick={() => dispatch(openConfirmDeleteColumn({ columnId: column.id, columnTitle: column.title }))}
                        sx={{ color: 'text.disabled', '&:hover': { color: 'error.main', bgcolor: 'rgba(239,68,68,0.08)' } }}
                    >
                        <CloseIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>
            </Box>

            {/* Droppable Card Container */}
            <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                    <Box
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        sx={{
                            minHeight: 150,
                            p: 1.5,
                            borderRadius: '24px',
                            bgcolor: snapshot.isDraggingOver ? 'rgba(0,0,0,0.03)' : 'rgba(0,0,0,0.01)',
                            border: '2px solid transparent',
                            transition: 'background-color 0.2s ease',
                        }}
                    >
                        {paginatedCards.map((card, index) => (
                            <KanbanCard key={card.id} card={card} index={index} />
                        ))}
                        {provided.placeholder}

                        {/* Pagination: Load More Button */}
                        {hasMore && (
                            <Button
                                fullWidth
                                size="small"
                                onClick={() => setPage(p => p + 1)}
                                sx={{ color: 'primary.main', fontWeight: 600, fontSize: 12, mb: 1 }}
                            >
                                Load more tasks...
                            </Button>
                        )}

                        {/* Add Task Button */}
                        <Button
                            fullWidth
                            variant="text"
                            onClick={() => dispatch(openAddCardModal(column.id))}
                            startIcon={<AddIcon />}
                            sx={{
                                mt: 1,
                                py: 1.25,
                                borderRadius: '16px',
                                color: 'text.secondary',
                                fontWeight: 600,
                                fontSize: 13,
                                textTransform: 'none',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    bgcolor: '#fff',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                    color: 'primary.main',
                                    transform: 'translateY(-2px)'
                                }
                            }}
                        >
                            Add New Task
                        </Button>
                    </Box>
                )}
            </Droppable>
        </Box>
    );
}
