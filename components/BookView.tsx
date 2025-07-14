import React from 'react';
import { JournalEntryData } from '@/types';
import { ArrowLeft, Pencil, Trash2 } from './icons';

interface BookViewProps {
    entry: JournalEntryData;
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const BookView: React.FC<BookViewProps> = ({ entry, onBack, onEdit, onDelete }) => (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl w-full p-4 md:p-8 animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 font-semibold transition-colors">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Journal
            </button>
            <div className="flex gap-4">
                <button onClick={onEdit} className="flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors p-2 rounded-lg hover:bg-blue-100">
                    <Pencil className="w-5 h-5 mr-2" /> Edit
                </button>
                <button onClick={onDelete} className="flex items-center text-red-600 hover:text-red-800 font-semibold transition-colors p-2 rounded-lg hover:bg-red-100">
                    <Trash2 className="w-5 h-5 mr-2" /> Delete
                </button>
            </div>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2 flex-shrink-0">
                <img
                    src={entry.image && entry.image.trim() !== '' ? entry.image : 'https://placehold.co/600x800/d1d5db/4b5563?text=Image+Not+Found'}
                    alt={entry.title}
                    className="rounded-lg shadow-md w-full h-full object-cover"
                />
            </div>
            <div className="md:w-1/2 prose prose-lg max-w-none text-gray-700">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">{entry.title}</h1>
                <p className="text-gray-500 text-base mb-6">{entry.date}</p>
                {entry.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
                {entry.blockquote && (
                    <blockquote className="border-l-4 border-rose-300 pl-4 italic my-6 text-xl">
                        {entry.blockquote}
                    </blockquote>
                )}
            </div>
        </div>
    </div>
);

export default BookView;