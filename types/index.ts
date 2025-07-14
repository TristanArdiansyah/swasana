export interface JournalEntryData {
    id: number;
    date: string;
    title: string;
    content: string[];
    image?: string;
    blockquote?: string;
}