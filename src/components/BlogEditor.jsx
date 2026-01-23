import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PixelButton, PixelContainer } from './ui/PixelUI';

const BlogEditor = ({ onPostCreated }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [tag, setTag] = useState('News'); // News, Update, Guide
    const [authorName, setAuthorName] = useState('Admin');
    const [hideAuthor, setHideAuthor] = useState(false);
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    const handlePublish = async () => {
        if (!title || !content) return alert('Заголовок и текст обязательны!');
        setLoading(true);

        const { error } = await supabase
            .from('posts')
            .insert([{
                title,
                content,
                image_url: image,
                tag,
                author_name: authorName,
                hide_author: hideAuthor
            }]);

        setLoading(false);

        if (error) {
            alert('Ошибка публикации: ' + error.message);
        } else {
            alert('Пост опубликован!');
            setTitle('');
            setContent('');
            setImage('');
            if (onPostCreated) onPostCreated();
        }
    };

    return (
        <PixelContainer title="NEW TRANSMISSION" className="mb-8">
            <div className="flex flex-col gap-4">
                {/* Title */}
                <div className="nes-field">
                    <label htmlFor="title_field">Title</label>
                    <input
                        type="text"
                        id="title_field"
                        className="nes-input is-dark"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Epic Update v1.0"
                    />
                </div>

                {/* Tag & Author Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="nes-field">
                        <label htmlFor="tag_select">Категория</label>
                        <div className="nes-select is-dark">
                            <select required id="tag_select" value={tag} onChange={(e) => setTag(e.target.value)}>
                                <option value="News">News</option>
                                <option value="Update">Update</option>
                                <option value="Guide">Guide</option>
                                <option value="Event">Event</option>
                            </select>
                        </div>
                    </div>

                    <div className="nes-field">
                        <label htmlFor="author_field">Автор</label>
                        <div className="flex gap-2 items-center">
                            <input
                                type="text"
                                id="author_field"
                                className="nes-input is-dark"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                disabled={hideAuthor}
                            />
                            <label className="flex items-center gap-2 text-xs cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="nes-checkbox is-dark"
                                    checked={hideAuthor}
                                    onChange={(e) => setHideAuthor(e.target.checked)}
                                />
                                <span>Скрыть</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Image URL */}
                <div className="nes-field">
                    <label htmlFor="image_field">Image URL (Optional)</label>
                    <input
                        type="text"
                        id="image_field"
                        className="nes-input is-dark"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="https://..."
                    />
                </div>

                {/* Content Editor */}
                <div className="nes-field">
                    <label htmlFor="content_field">Content (Markdown)</label>
                    {!previewMode ? (
                        <textarea
                            id="content_field"
                            className="nes-textarea is-dark"
                            rows="10"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Write your adventure here... Supports **bold**, *italic*, [links](url)"
                        ></textarea>
                    ) : (
                        <div className="nes-container is-dark is-rounded min-h-[200px] text-left">
                            {/* Simple Markdown Preview (Use a library like react-markdown for full support, applying basic formatting for now) */}
                            <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed">{content}</p>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="flex gap-4 justify-end mt-4">
                    <PixelButton onClick={() => setPreviewMode(!previewMode)}>
                        {previewMode ? 'EDIT' : 'PREVIEW'}
                    </PixelButton>
                    <PixelButton color="success" onClick={handlePublish} disabled={loading}>
                        {loading ? 'SENDING...' : 'PUBLISH'}
                    </PixelButton>
                </div>
            </div>
        </PixelContainer>
    );
};

export default BlogEditor;
