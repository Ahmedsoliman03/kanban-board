import { BuiltInStatus, ColumnId } from '../types/kanban';

export interface StatusConfig {
    id: ColumnId;
    label: string;
    colorVar: string;
    textColorVar: string;
}

export const STATUSES: Record<BuiltInStatus, StatusConfig> = {
    todo: {
        id: 'todo',
        label: 'To Do',
        colorVar: '--status-todo-bg',
        textColorVar: '--status-todo-text',
    },
    inprogress: {
        id: 'inprogress',
        label: 'In Progress',
        colorVar: '--status-inprogress-bg',
        textColorVar: '--status-inprogress-text',
    },
    review: {
        id: 'review',
        label: 'In Review',
        colorVar: '--status-review-bg',
        textColorVar: '--status-review-text',
    },
    done: {
        id: 'done',
        label: 'Done',
        colorVar: '--status-done-bg',
        textColorVar: '--status-done-text',
    },
};

export function getStatus(statusId: ColumnId): StatusConfig {
    return (STATUSES as Record<string, StatusConfig>)[statusId] ?? {
        id: statusId,
        label: statusId,
        colorVar: '--status-default-bg',
        textColorVar: '--status-default-text',
    };
}
