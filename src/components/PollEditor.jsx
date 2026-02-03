import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { PixelButton, PixelContainer } from './ui/PixelUI';
import { Plus, Trash2, Layout, Type, Hash, CheckSquare, Save, Share2 } from 'lucide-react';

const PollEditor = () => {
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
        } catch (err) {
            setMessage('Ошибка: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const shareLink = `${window.location.origin}/PDSite/polls/${savedPollId}`;

    return (
        <PixelContainer dark title="КОНСТРУКТОР ОПРОСОВ" className="animate-slide-in">
            <div className="space-y-6">
                <div className="space-y-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#1a1c1e] border-2 border-[#4b6584] rounded-lg p-3 text-white text-xl font-bold outline-none focus:border-primary"
                        placeholder="Заголовок опроса..."
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-[#1a1c1e] border-2 border-[#4b6584] rounded-lg p-3 text-white outline-none focus:border-primary h-20"
                        placeholder="Описание для игроков..."
                    />
                </div>

                <div className="space-y-6 mt-8">
                    {fields.map((field, idx) => (
                        <div key={field.id} className="p-4 border-2 border-[#4b6584] rounded-xl bg-black/30 relative group animate-slide-in">
                            <button
                                onClick={() => removeField(field.id)}
                                className="absolute -top-3 -right-3 bg-error text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2 mb-4">
                                {field.type === 'choice' && <CheckSquare className="w-4 h-4 text-primary" />}
                                {field.type === 'scale' && <Hash className="w-4 h-4 text-warning" />}
                                {field.type === 'text' && <Type className="w-4 h-4 text-success" />}
                                <span className="text-[10px] font-black uppercase text-gray-500">Поле #{idx + 1} • {field.type}</span>
                            </div>

                            <input
                                type="text"
                                value={field.question}
                                onChange={(e) => updateField(field.id, 'question', e.target.value)}
                                className="w-full bg-transparent border-b-2 border-[#4b6584] p-2 text-white font-bold outline-none focus:border-primary mb-4"
                                placeholder="Введите вопрос..."
                            />

                            {field.type === 'choice' && (
                                <div className="space-y-2 pl-4">
                                    {field.options.map((opt, oIdx) => (
                                        <div key={oIdx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={opt}
                                                onChange={(e) => updateOption(field.id, oIdx, e.target.value)}
                                                className="flex-1 bg-[#1a1c1e] border border-[#4b6584] rounded p-2 text-sm text-white outline-none"
                                                placeholder={`Вариант ${oIdx + 1}`}
                                            />
                                        </div>
                                    ))}
                                    <button onClick={() => addOption(field.id)} className="text-xs text-primary font-bold hover:underline">
                                        + Добавить вариант
                                    </button>
                                </div>
                            )}

                            {field.type === 'scale' && (
                                <div className="text-xs text-gray-400 pl-4 py-2 border-l-2 border-warning">
                                    Игроки увидят шкалу выбора от 1 до 10.
                                </div>
                            )}

                            {field.type === 'text' && (
                                <div className="text-xs text-gray-400 pl-4 py-2 border-l-2 border-success">
                                    Текстовое поле для свободного ответа.
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-8">
                    <button onClick={() => addField('choice')} className="p-3 bg-white/5 rounded-xl border-2 border-[#4b6584] hover:bg-primary/10 transition-colors flex flex-col items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-primary" />
                        <span className="text-[8px] font-black uppercase">Выбор</span>
                    </button>
                    <button onClick={() => addField('scale')} className="p-3 bg-white/5 rounded-xl border-2 border-[#4b6584] hover:bg-warning/10 transition-colors flex flex-col items-center gap-2">
                        <Hash className="w-5 h-5 text-warning" />
                        <span className="text-[8px] font-black uppercase">Шкала</span>
                    </button>
                    <button onClick={() => addField('text')} className="p-3 bg-white/5 rounded-xl border-2 border-[#4b6584] hover:bg-success/10 transition-colors flex flex-col items-center gap-2">
                        <Type className="w-5 h-5 text-success" />
                        <span className="text-[8px] font-black uppercase">Текст</span>
                    </button>
                </div>

                <PixelButton color="success" onClick={handleSave} disabled={loading} className="w-full mt-6">
                    <Save className="w-4 h-4 mr-2 inline" /> {loading ? 'СОХРАНЕНИЕ...' : 'ОПУБЛИКОВАТЬ ОПРОС'}
                </PixelButton>

                {message && (
                    <div className={`p-4 rounded-lg text-center font-bold text-sm ${message.startsWith('Ошибка') ? 'bg-error/20 text-error' : 'bg-success/20 text-success'}`}>
                        {message}
                        {savedPollId && (
                            <div className="mt-4 p-3 bg-black/40 rounded-xl border border-white/10 flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 truncate mr-4">{shareLink}</span>
                                <button onClick={() => { navigator.clipboard.writeText(shareLink); alert('Ссылка скопирована!'); }}>
                                    <Share2 className="w-4 h-4 text-primary" />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PixelContainer>
    );
};

export default PollEditor;
