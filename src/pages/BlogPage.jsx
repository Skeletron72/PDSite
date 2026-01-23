import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlogPage = () => {
    const navigate = useNavigate();

    const posts = [
        {
            id: 1,
            tag: "Обновление",
            color: "#55efc4",
            title: "Свадьбы на утесе и новые костюмы",
            date: "24 Января, 2026",
            excerpt: "Теперь вы можете официально закрепить свой союз с другим игроком или NPC. Свадебная церемония дает уникальные бонусы к выносливости."
        },
        {
            id: 2,
            tag: "Гайд",
            color: "#81ecec",
            title: "Как правильно тереть спину другу: Максимизируем баффы",
            date: "22 Января, 2026",
            excerpt: "Подробный разбор механики гигиены. Почему мыться вместе эффективнее и как не получить дебафф 'Грязнуля'."
        },
        {
            id: 3,
            tag: "Мир",
            color: "#fab1a0",
            title: "Первая экспедиция: Джунгли Шепота",
            date: "18 Января, 2026",
            excerpt: "Обзор новой локации для экспедиций. Какие ресурсы можно найти в джунглях и как не заблудиться в меняющемся лабиринте."
        }
    ];

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Nav */}
            <nav className="glass-dark py-4 px-6 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-warning border-2 border-black flex items-center justify-center text-black text-[10px] font-bold">PD</div>
                    <span className="text-xl font-bold tracking-tighter text-warning">POCKET DALE</span>
                </div>
                <button className="btn-playful scale-75" onClick={() => navigate('/')}>Назад</button>
            </nav>

            <main className="max-w-4xl mx-auto py-20 px-6">
                <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">Блог Архипелага</h1>
                <p className="text-gray-400 mb-16 font-bold uppercase tracking-widest text-sm">История нашего мира, шаг за шагом</p>

                <div className="space-y-12">
                    {posts.map(post => (
                        <article key={post.id} className="cozy-card group cursor-pointer overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                            <div className="w-full md:w-48 h-48 bg-gray-100 rounded-[1.5rem] shrink-0 border-4 border-white shadow-inner flex items-center justify-center text-gray-300 font-bold uppercase text-[10px]">
                                [Картинка поста]
                            </div>
                            <div>
                                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase text-white mb-4 inline-block" style={{ backgroundColor: post.color }}>
                                    {post.tag}
                                </span>
                                <h2 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">
                                    {post.title}
                                </h2>
                                <p className="text-gray-500 leading-relaxed mb-6 text-sm">
                                    {post.excerpt}
                                </p>
                                <p className="text-[10px] opacity-40 font-bold uppercase">{post.date}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </main>

            <footer className="py-20 bg-[#2d3436] text-white mt-20 text-center">
                <p className="text-sm opacity-40">© 2026 POCKET DALE BLOG</p>
            </footer>
        </div>
    );
};

export default BlogPage;
