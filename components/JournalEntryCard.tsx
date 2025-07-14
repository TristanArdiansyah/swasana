import React from 'react';
import { JournalEntryData } from '@/types';
import { Calendar } from './icons';

interface JournalEntryCardProps {
    entry: JournalEntryData;
    onClick: () => void;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry, onClick }) => (
    <div onClick={onClick} className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 w-full transform transition-all duration-300 hover:scale-102 hover:shadow-2xl cursor-pointer">
        <div className="flex items-center text-gray-500 mb-2">
            <Calendar className="w-4 h-4 mr-2" />
            <time className="font-medium text-sm">{entry.date}</time>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{entry.title}</h2>
        <h2 className="text-md italic text-gray-500">{entry.blockquote}</h2>
        <br />
        <div className="flex items-end-safe text-gray-500 mb-2">
            Created at {entry.created_at}
        </div>
    </div>
);

export default JournalEntryCard;