'use client';

import React from 'react';
import toast from 'react-hot-toast';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Typography, IconButton, Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/reduxStore';
import {
    closeModal, addCard, updateCard, deleteCard, deleteColumn,
} from '../store/kanbanSlice';

/**
 * Universal Modal component for the board.
 * Dynamically renders content based on the current modalState in Redux.
 */
export default function Modal() {
    const dispatch = useDispatch();
    const { data, modalState } = useSelector((state: RootState) => state.kanban);

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');

    // Pre-fill form fields when editing a card
    React.useEffect(() => {
        if (modalState.type === 'edit-card') {
            setTitle(modalState.card.title);
            setDescription(modalState.card.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [modalState.type]);

    if (modalState.type === 'closed') return null;

    const handleClose = () => dispatch(closeModal());

    /**
     * Dispatches the appropriate Redux action based on the modal type.
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        switch (modalState.type) {
            case 'add-card':
                if (title.trim()) {
                    dispatch(addCard({ columnId: modalState.columnId, cardData: { title: title.trim(), description: description.trim() } }));
                    toast.success('Task added');
                }
                break;
            case 'edit-card':
                if (title.trim()) {
                    dispatch(updateCard({ cardId: modalState.card.id, updates: { title: title.trim(), description: description.trim() } }));
                    toast.success('Task updated');
                }
                break;
            case 'confirm-delete-card':
                dispatch(deleteCard(modalState.cardId));
                toast.success('Task deleted');
                break;
            case 'confirm-delete-column':
                dispatch(deleteColumn(modalState.columnId));
                toast.success('Column deleted');
                break;
        }
    };

    const isConfirm = modalState.type.startsWith('confirm-delete');

    /**
     * Resolves UI text and configuration based on the modal purpose.
     */
    const getModalConfig = () => {
        switch (modalState.type) {
            case 'add-card':
                return {
                    title: 'Add Task',
                    subtitle: data.columns[modalState.columnId]?.title,
                    primaryAction: 'Add Task',
                    color: 'primary' as const,
                };
            case 'edit-card':
                return {
                    title: 'Edit Task',
                    primaryAction: 'Save',
                    color: 'primary' as const,
                };
            case 'confirm-delete-card':
                return {
                    title: 'Delete Task',
                    primaryAction: 'Delete',
                    color: 'error' as const,
                    contentSnippet: `Are you sure you want to delete "${modalState.cardTitle}"? This action cannot be undone.`,
                };
            case 'confirm-delete-column':
                return {
                    title: 'Delete Column',
                    primaryAction: 'Delete',
                    color: 'error' as const,
                    contentSnippet: `Are you sure you want to delete "${modalState.columnTitle}" and all its tasks? This action cannot be undone.`,
                };
            default:
                return { title: '', primaryAction: '', color: 'primary' as const };
        }
    };

    const config = getModalConfig();

    return (
        <Dialog
            open
            onClose={handleClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                component: 'form',
                onSubmit: handleSubmit,
                sx: { borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }
            }}
        >
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Box>
                    <Typography variant="h6" component="span" fontWeight={700}>
                        {config.title}
                    </Typography>
                    {config.subtitle && (
                        <Typography variant="caption" color="text.secondary" display="block">
                            {config.subtitle}
                        </Typography>
                    )}
                </Box>
                <IconButton size="small" onClick={handleClose} sx={{ color: 'text.disabled' }}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: '16px !important', display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {isConfirm ? (
                    <Typography variant="body2" color="text.primary">
                        {config.contentSnippet}
                    </Typography>
                ) : (
                    <>
                        <TextField
                            label="Title"
                            placeholder="Task title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            autoFocus
                            fullWidth
                            size="small"
                        />
                        {(modalState.type === 'add-card' || modalState.type === 'edit-card') && (
                            <TextField
                                label="Description"
                                placeholder="Task description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={3}
                                fullWidth
                                size="small"
                            />
                        )}
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 1 }}>
                <Button
                    variant="text"
                    onClick={handleClose}
                    sx={{ color: 'text.secondary', fontWeight: 500 }}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    variant="contained"
                    color={config.color}
                    disabled={!isConfirm && !title.trim()}
                    disableElevation
                    sx={{
                        borderRadius: 2,
                        px: 3,
                        fontWeight: 600,
                        ...(config.color === 'primary' && { bgcolor: 'primary.main', '&:hover': { bgcolor: '#333' } })
                    }}
                >
                    {config.primaryAction}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
