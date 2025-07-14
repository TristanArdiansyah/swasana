"use client"
import React, { useEffect, useState } from 'react';
import { JournalEntryData } from '@/types';
import { Heart, PlusCircle } from '@/components/icons';
import JournalEntryCard from '@/components/JournalEntryCard';
import BookView from '@/components/BookView';
import EditorView from '@/components/EditorView';

const OurStoryPage: React.FC = () => {
    type View = 'LIST' | 'BOOK' | 'EDITOR';

    const [journalEntries, setJournalEntries] = useState<JournalEntryData[]>([]);
    const [currentView, setCurrentView] = useState<View>('LIST');
    const [selectedEntry, setSelectedEntry] = useState<JournalEntryData | null>(null);
    const [editingEntry, setEditingEntry] = useState<Partial<JournalEntryData> | null>(null);

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const response = await fetch('/api/stories');
                if (!response.ok) {
                    throw new Error('Failed to fetch stories');
                }
                const data = await response.json();
                setJournalEntries(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchStories();
    }, []);

    const showListView = () => {
        setCurrentView('LIST');
        setSelectedEntry(null);
        setEditingEntry(null);
    };

    const showBookView = (entry: JournalEntryData) => {
        setSelectedEntry(entry);
        setCurrentView('BOOK');
    };

    const showEditorView = (entry: Partial<JournalEntryData> | null) => {
        setEditingEntry(entry);
        setCurrentView('EDITOR');
    };

    const handleSaveEntry = async (entryToSave: JournalEntryData) => {
        const exists = journalEntries.some(e => e.id === entryToSave.id);

        try {
            if (exists) {
                const response = await fetch(`/api/stories/${entryToSave.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(entryToSave),
                });
                if (!response.ok) throw new Error('Failed to update story');
                const updatedStory = await response.json();
                setJournalEntries(journalEntries.map(e => e.id === updatedStory.story.id ? updatedStory.story : e));
            } else {
                const response = await fetch('/api/stories', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(entryToSave),
                });
                if (!response.ok) throw new Error('Failed to add story');
                const newStory = await response.json();
                setJournalEntries([...journalEntries, newStory.story]);
            }
        } catch (error) {
            console.error(error)
        } finally {
            showListView();
        }
    };

    const handleDeleteEntry = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this story?')) {
            try {
                const response = await fetch(`/api/stories/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete story');
                setJournalEntries(journalEntries.filter(e => e.id !== id));
                showListView();
            } catch (error) {
                console.error(error);
            }
        }
    };

    const renderContent = () => {
        switch (currentView) {
            case 'BOOK':
                if (!selectedEntry) return null;
                return <BookView
                    entry={selectedEntry}
                    onBack={showListView}
                    onEdit={() => showEditorView(selectedEntry)}
                    onDelete={() => handleDeleteEntry(selectedEntry.id)}
                />;
            case 'EDITOR':
                return <EditorView
                    entry={editingEntry}
                    onSave={handleSaveEntry}
                    onCancel={showListView}
                />;
            case 'LIST':
            default:
                return (
                    <>
                        <header className="text-center py-12">
                            <div className="inline-block mb-4">
                                <Heart className="w-16 h-16 text-rose-400 animate-pulse" fill="currentColor" />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 tracking-tight">
                                Poems
                            </h1>
                            <p className="mt-4 text-lg md:text-xl text-gray-600">
                                A collection of poems, written wholeheartedly, <br /> Ardiansyah-Swasana.
                            </p>
                        </header>
                        <main className="max-w-4xl mx-auto">
                            <div className="flex justify-end mb-8">
                                <button onClick={() => showEditorView(null)} className="flex items-center text-white bg-rose-600 hover:bg-rose-700 font-semibold transition-colors p-3 rounded-lg shadow-md">
                                    <PlusCircle className="w-5 h-5 mr-2" /> Add New Story
                                </button>
                            </div>
                            {journalEntries.map((entry) => (
                                <JournalEntryCard
                                    key={entry.id}
                                    entry={entry}
                                    onClick={() => showBookView(entry)}
                                />
                            ))}
                        </main>
                        <footer className="text-center py-10 mt-8 border-t border-gray-200">
                            <p className="text-gray-500">
                                Built with love, for the one I love.
                            </p>
                        </footer>
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-sky-100 font-sans">
            <div className="container mx-auto p-4 md:p-8 max-w-5xl">
                {renderContent()}
            </div>
        </div>
    );
}

export default OurStoryPage;