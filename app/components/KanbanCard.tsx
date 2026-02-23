'use client';

import React from 'react';
import { Card as MuiCard, CardContent, Typography, Chip, Box, Tooltip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Draggable } from '@hello-pangea/dnd';
import { useDispatch } from 'react-redux';
import { Card } from '../types/kanban';
import { getStatus } from '../config/statuses';
import { openEditCardModal, openConfirmDeleteCard } from '../store/kanbanSlice';

interface KanbanCardProps {
    card: Card;
    index: number;
}

/**
 * Individual Kanban Card component.
 * Acts as a Draggable element for moving tasks between columns.
 */
export default function KanbanCard({ card, index }: KanbanCardProps) {
    const dispatch = useDispatch();
    const statusConfig = getStatus(card.status);

    return (
        <Draggable draggableId={card.id} index={index}>
            {(provided, snapshot) => (
                <MuiCard
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    elevation={snapshot.isDragging ? 8 : 0}
                    variant="outlined"
                    sx={{
                        mb: 1.5,
                        borderRadius: '16px',
                        border: '1px solid',
                        borderColor: 'rgba(0,0,0,0.06)',
                        bgcolor: '#fff',
                        transition: 'box-shadow 0.2s ease',
                        '&:hover': {
                            borderColor: 'rgba(0,0,0,0.12)'
                        },
                    }}
                >
                    <CardContent sx={{ p: '16px !important' }}>
                        <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.4, mb: 1, color: 'text.primary' }}>
                            {card.title}
                        </Typography>

                        {card.description && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    lineHeight: 1.6,
                                    mb: 2,
                                    fontSize: '0.75rem'
                                }}
                            >
                                {card.description}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                            <Chip
                                label={statusConfig.label}
                                size="small"
                                sx={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    height: 20,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    bgcolor: `var(${statusConfig.colorVar})`,
                                    color: `var(${statusConfig.textColorVar})`,
                                    borderRadius: '6px'
                                }}
                            />

                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                                <Tooltip title="Edit Task">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => { e.stopPropagation(); dispatch(openEditCardModal(card)); }}
                                        sx={{
                                            p: 0.5,
                                            color: 'text.disabled',
                                            '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' }
                                        }}
                                    >
                                        <EditIcon sx={{ fontSize: 16 }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Task">
                                    <IconButton
                                        size="small"
                                        onClick={(e) => { e.stopPropagation(); dispatch(openConfirmDeleteCard({ cardId: card.id, cardTitle: card.title })); }}
                                        sx={{
                                            p: 0.5,
                                            color: 'text.disabled',
                                            '&:hover': { color: 'error.main', bgcolor: 'rgba(239,68,68,0.08)' }
                                        }}
                                    >
                                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>
                    </CardContent>
                </MuiCard>
            )}
        </Draggable>
    );
}
