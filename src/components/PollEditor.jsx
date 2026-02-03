import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PixelButton, PixelContainer } from './ui/PixelUI';
import { Plus, Trash2, Layout, Type, Hash, CheckSquare, Save, Share2 } from 'lucide-react';

const PollEditor = ({ onSave }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [fields, setFields] = useState([
        { id: Math.random().toString(36).substr(2, 9), type: 'choice', question: '', options: [''], required: true }
    ]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [savedPollId, setSavedPollId] = useState(null);

    const addField = (type) => {
        setFields([...fields, {
            id: Math.random().toString(36).substr(2, 9),
            type,
            question: '',
            options: type === 'choice' ? [''] : [],
            required: true
        }]);
    };

    const removeField = (id) => {
        setFields(fields.filter(f => f.id !== id));
    };

    const updateField = (id, key, value) => {
        setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
    };

    const addOption = (fId) => {
        setFields(fields.map(f => f.id === fId ? { ...f, options: [...f.options, ''] } : f));
    };

    const updateOption = (fId, oIdx, value) => {
        setFields(fields.map(f => {
            if (f.id === fId) {
                const newOpts = [...f.options];
                newOpts[oIdx] = value;
                return { ...f, options: newOpts };
            }
            return f;
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setMessage('');
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from('polls')
                .insert([{
                    title,
                    description,
                    fields,
                    creator_id: user.id
                }])
                .select()
                .single();

            if (error) throw error;
            setSavedPollId(data.id);
            setMessage('Опрос успешно опубликован!');
            if (onSave) onSave();
        } catch (err) {
            setMessage('Ошибка: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const shareLink = `${window.location.origin}/PDSite/#/polls/${savedPollId}`;

    return (
        <div className="cozy-card border-2 animate-slide-in h-fit">
            <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8">Конструктор Опросов</h3>

            <div className="space-y-8">
                {/* Poll Metadata */}
                <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-2">Общая информация</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[var(--bg-body)] border-2 border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-main)] font-black text-xl outline-none focus:border-primary transition-colors"
                        placeholder="Название опроса..."
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-[var(--bg-body)] border-2 border-[var(--border-color)] rounded-2xl p-4 text-[var(--text-main)] font-bold outline-none focus:border-primary transition-colors h-24 resize-none text-sm"
                        placeholder="Краткое описание для игроков..."
                    />
                </div>

                {/* Fields List */}
                <div className="space-y-6">
                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest pl-2">Вопросы анкеты</label>
                    {fields.map((field, idx) => (
                        <div key={field.id} className="p-6 rounded-[2rem] border-2 border-[var(--border-color)] bg-[var(--bg-body)] relative group animate-slide-in">
                            <button
                                onClick={() => removeField(field.id)}
                                className="absolute -top-3 -right-3 bg-error text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2 mb-6">
                                <div className={`p-2 rounded-lg ${field.type === 'choice' ? 'bg-primary/20 text-primary' : field.type === 'scale' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                                    {field.type === 'choice' && <CheckSquare className="w-4 h-4" />}
                                    {field.type === 'scale' && <Hash className="w-4 h-4" />}
                                    {field.type === 'text' && <Type className="w-4 h-4" />}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Вопрос #{idx + 1}</span>
                            </div>

                            <input
                                type="text"
                                value={field.question}
                                onChange={(e) => updateField(field.id, 'question', e.target.value)}
                                className="w-full bg-transparent border-b-2 border-[var(--border-color)] p-2 text-[var(--text-main)] font-black outline-none focus:border-primary mb-6"
                                placeholder="Введите ваш вопрос..."
                            />

                            {field.type === 'choice' && (
                                <div className="space-y-3 pl-4">
                                    {field.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => updateOption(field.id, oIdx, e.target.value)}
                                                className="flex-1 bg-white/5 border border-[var(--border-color)] rounded-xl py-2 px-4 text-sm text-[var(--text-main)] outline-none focus:border-primary"
                                                placeholder={`Вариант ${oIdx + 1}`}
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addOption(field.id)}
                                        className="text-[10px] text-primary font-black uppercase hover:tracking-widest transition-all mt-2 pl-2"
                                    >
                                        + Добавить вариант
                                    </button>
                                </div>
                            )}

                            {field.type === 'scale' && <p className="text-[10px] text-gray-500 italic pl-4">Шкала выбора от 1 до 10</p>}
                        </div>
                    ))}
                </div>

                {/* Field Type Selectors */}
                <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => addField('choice')} className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-[var(--border-color)] hover:border-primary hover:bg-primary/5 transition-all gap-2 group">
                        <CheckSquare className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase">Выбор</span>
                    </button>
                    <button onClick={() => addField('scale')} className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-[var(--border-color)] hover:border-warning hover:bg-warning/5 transition-all gap-2 group">
                        <Hash className="w-5 h-5 text-warning group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase">Шкала</span>
                    </button>
                    <button onClick={() => addField('text')} className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-[var(--border-color)] hover:border-success hover:bg-success/5 transition-all gap-2 group">
                        <Type className="w-5 h-5 text-success group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-black uppercase">Текст</span>
                    </button>
                </div>

                <div className="pt-6">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="btn-playful w-full py-6 text-xl shadow-xl bg-success text-white border-white/10"
                    >
                        {loading ? 'СОХРАНЕНИЕ...' : 'ОПУБЛИКОВАТЬ ОПРОС'}
                    </button>
                </div>

                {message && (
                    <div className={`p-6 rounded-[1.5rem] border-2 animate-slide-in ${message.startsWith('Ошибка') ? 'bg-error/10 border-error text-error' : 'bg-success/10 border-success text-success'}`}>
                        <p className="font-black uppercase text-xs text-center">{message}</p>
                        {savedPollId && (
                            <div className="mt-6 p-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between gap-4">
                                <span className="text-[10px] font-bold text-gray-500 truncate">{shareLink}</span>
                                <button
                                    className="p-2 bg-primary/20 rounded-lg text-primary hover:bg-primary hover:text-black transition-colors"
                                    onClick={() => { navigator.clipboard.writeText(shareLink); alert('Ссылка скопирована!'); }}
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PollEditor;
