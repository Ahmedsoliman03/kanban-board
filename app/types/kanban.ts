export type BuiltInStatus = 'todo' | 'inprogress' | 'review' | 'done';

// Accepts the built-in statuses with autocomplete, plus any dynamic column id string
export type ColumnId = BuiltInStatus | (string & {});

export interface Card {
  id: string;
  title: string;
  description: string;
  status: ColumnId;
}

export interface Column {
  id: ColumnId;
  title: string;
  cardIds: string[];
}

export interface BoardData {
  columns: Record<ColumnId, Column>;
  cards: Record<string, Card>;
  columnOrder: ColumnId[];
}
