"use client"
import React, { useEffect, useState } from 'react';
import { JournalEntryData } from '@/types';

interface EditorViewProps {
    entry: Partial<JournalEntryData> | null;
    onSave: (entry: JournalEntryData) => void;
    onCancel: () => void;
}

const EditorView: React.FC<EditorViewProps> = ({ entry, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Partial<JournalEntryData>>({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        setFormData(entry || {});
    }, [entry]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, content: e.target.value.split('\n') }));
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await fetch(
                `/api/upload?filename=${encodeURIComponent(file.name)}`,
                {
                    method: 'POST',
                    body: file,
                },
            );

            if (!response.ok) {
                throw new Error('Upload failed.');
            }

            const newBlob = await response.json();
            setFormData(prev => ({ ...prev, image: newBlob.url }));

        } catch (error) {
            console.error('Failed to upload file:', error);
            alert('Error uploading file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalEntry: JournalEntryData = {
            id: formData.id || Date.now(),
            title: formData.title || 'Untitled',
            date: formData.date || new Date().toISOString().split('T')[0],
            content: formData.content || [],
            image: formData.image || '',
            blockquote: formData.blockquote || '',
        };
        onSave(finalEntry);
    };

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl w-full p-4 md:p-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{entry?.id ? 'Edit Story' : 'Add a New Story'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input type="text" name="title" id="title" value={formData.title || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" required />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" id="date" value={formData.date || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" required />
                </div>

                {/* --- Image Uploader Input --- */}
                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">Story Image</label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                    />
                    {uploading && <p className="text-sm text-gray-500 mt-2 animate-pulse">Uploading...</p>}

                    {/* --- Image Preview --- */}
                    {formData.image && !uploading && (
                        <div className="mt-4">
                            <img src={formData.image} alt="Image Preview" className="rounded-lg shadow-md w-full h-auto max-w-xs object-cover" />
                        </div>
                    )}
                </div>

                <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700">Story (one paragraph per line)</label>
                    <textarea name="content" id="content" value={Array.isArray(formData.content) ? formData.content.join('\n') : ''} onChange={handleContentChange} rows={10} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" required></textarea>
                </div>
                <div>
                    <label htmlFor="blockquote" className="block text-sm font-medium text-gray-700">Quote (optional)</label>
                    <input type="text" name="blockquote" id="blockquote" value={formData.blockquote || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm" />
                </div>
                <div className="flex justify-end gap-4">
                    <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancel</button>
                    <button type="submit" disabled={uploading} className="px-4 py-2 text-sm font-medium text-white bg-rose-600 border border-transparent rounded-md shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
                        {uploading ? 'Uploading...' : 'Save Story'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditorView;