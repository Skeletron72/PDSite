import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PixelButton, PixelContainer } from './ui/PixelUI';

const BlogEditor = ({ onSave }) => {
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
            if (onSave) onSave();
        }
    };

    return (
        <div className="cozy-card border-2 animate-slide-in">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Новый Пост</h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className={`text-[10px] font-black uppercase px-4 py-1 rounded-full border-2 transition-all ${previewMode ? 'bg-primary text-black border-primary' : 'border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                    >
                        {previewMode ? 'EDIT' : 'PREVIEW'}
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {!previewMode ? (
                    <>
                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-2">Заголовок</label>
                            <input
                                type="text"
                                className="w-full bg-[var(--bg-body)] border-2 border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-primary transition-colors"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Название вашей новости..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-2">Категория</label>
                                <select
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    className="w-full bg-[var(--bg-body)] border-2 border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-primary transition-colors appearance-none"
                                >
                                    <option value="News">Новости</option>
                                    <option value="Update">Обновление</option>
                                    <option value="Guide">Гайд</option>
                                    <option value="Event">Событие</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-2">Автор</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className="w-full bg-[var(--bg-body)] border-2 border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-primary transition-colors pr-12"
                                        value={authorName}
                                        onChange={(e) => setAuthorName(e.target.value)}
                                        disabled={hideAuthor}
                                    />
                                    <button
                                        className="absolute right-4 top-1/2 -translate-y-1/2"
                                        onClick={() => setHideAuthor(!hideAuthor)}
                                    >
                                        <div className={`w-4 h-4 rounded border-2 transition-colors ${hideAuthor ? 'bg-primary border-primary' : 'border-gray-500'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-2">URL Изображения</label>
                            <input
                                type="text"
                                className="w-full bg-[var(--bg-body)] border-2 border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-primary transition-colors"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-2">Текст (Markdown)</label>
                            <textarea
                                className="w-full bg-[var(--bg-body)] border-2 border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-primary transition-colors min-h-[250px] resize-none"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Ваша история начинается здесь..."
                            />
                        </div>
                    </>
                ) : (
                    <div className="bg-[var(--bg-body)] rounded-3xl p-8 border-2 border-dashed border-[var(--border-color)] min-h-[400px]">
                        <h2 className="text-3xl font-black uppercase mb-4">{title || 'Без названия'}</h2>
                        <div className="flex gap-2 mb-8">
                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase">{tag}</span>
                            <span className="bg-white/5 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase">By {hideAuthor ? 'Anon' : authorName}</span>
                        </div>
                        {image && <img src={image} className="w-full h-48 object-cover rounded-xl mb-8 border-2 border-[var(--border-color)]" alt="Preview" />}
                        <p className="whitespace-pre-wrap font-sans text-lg leading-relaxed text-[var(--text-muted)]">{content || 'Текст отсутствует...'}</p>
                    </div>
                )}

                <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="btn-playful w-full py-6 text-xl shadow-xl"
                >
                    {loading ? 'ПУБЛИКАЦИЯ...' : 'ОПУБЛИКОВАТЬ'}
                </button>
            </div>
        </div>
    );
};

export default BlogEditor;
