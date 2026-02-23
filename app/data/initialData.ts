import { BoardData } from '../types/kanban';

/**
 * Initial mock data for the Kanban board.
 * Contains columns and initial tasks with Lorem Ipsum content.
 */
export const initialData: BoardData = {
    columnOrder: ['todo', 'inprogress', 'review', 'done'],
    columns: {
        todo: {
            id: 'todo',
            title: 'To Do',
            cardIds: ['card-1', 'card-2', 'card-3'],
        },
        inprogress: {
            id: 'inprogress',
            title: 'In Progress',
            cardIds: ['card-4', 'card-5'],
        },
        review: {
            id: 'review',
            title: 'In Review',
            cardIds: ['card-6'],
        },
        done: {
            id: 'done',
            title: 'Done',
            cardIds: ['card-7', 'card-8'],
        },
    },
    cards: {
        'card-1': {
            id: 'card-1',
            title: 'Lorem ipsum dolor sit amet',
            description: 'Consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            status: 'todo',
        },
        'card-2': {
            id: 'card-2',
            title: 'Ut enim ad minim veniam',
            description: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
            status: 'todo',
        },
        'card-3': {
            id: 'card-3',
            title: 'Duis aute irure dolor',
            description: 'In reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            status: 'todo',
        },
        'card-4': {
            id: 'card-4',
            title: 'Excepteur sint occaecat',
            description: 'Cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
            status: 'inprogress',
        },
        'card-5': {
            id: 'card-5',
            title: 'Sed ut perspiciatis unde',
            description: 'Omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
            status: 'inprogress',
        },
        'card-6': {
            id: 'card-6',
            title: 'At vero eos et accusamus',
            description: 'Et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.',
            status: 'review',
        },
        'card-7': {
            id: 'card-7',
            title: 'Nam libero tempore cum',
            description: 'Soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.',
            status: 'done',
        },
        'card-8': {
            id: 'card-8',
            title: 'Temporibus autem quibusdam',
            description: 'Et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae.',
            status: 'done',
        },
    },
};
