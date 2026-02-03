import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Heart, MessageCircle, Share2, Eye } from 'lucide-react';

const BlogPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [posts, setPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setPosts(data);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[var(--bg-body)] text-[var(--text-main)] transition-colors duration-300">
            {/* The global Navbar is already present in App.jsx layout */}

            <main className="max-w-4xl mx-auto py-20 px-6">
                <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">Блог Архипелага</h1>
                <p className="text-gray-400 mb-16 font-bold uppercase tracking-widest text-sm">История нашего мира, шаг за шагом</p>

                <div className="space-y-12">
                    {loading ? (
                        <p className="text-center text-gray-400 animate-pulse">Checking for signal...</p>
                    ) : posts.length === 0 ? (
                        <div className="text-center p-12 border-4 border-dashed border-gray-200 rounded-3xl">
                            <p className="text-gray-400 font-bold uppercase">No transmissions received yet.</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <article key={post.id} className="cozy-card group cursor-pointer overflow-hidden flex flex-col md:flex-row gap-8 items-center">
                                {post.image_url ? (
                                    <img src={post.image_url} alt={post.title} className="w-full md:w-48 h-48 object-cover rounded-[1.5rem] shrink-0 border-4 border-white shadow-inner" style={{ imageRendering: 'pixelated' }} />
                                ) : (
                                    <div className="w-full md:w-48 h-48 bg-gray-100 rounded-[1.5rem] shrink-0 border-4 border-white shadow-inner flex items-center justify-center text-gray-300 font-bold uppercase text-[10px]">
                                        [NO SIGNAL]
                                    </div>
                                )}
                                <div className="flex-1">
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase text-white mb-4 inline-block" style={{ backgroundColor: '#55efc4' }}>
                                        {post.tag || 'News'}
                                    </span>
                                    <h2 className="text-2xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">
                                        {post.title}
                                    </h2>
                                    <div className="text-gray-500 leading-relaxed mb-6 text-sm line-clamp-3">
                                        {/* Simple markdown strip for preview, or just show content */}
                                        {post.content.substring(0, 150)}...
                                    </div>
                                    <div className="flex justify-between items-center mt-6">
                                        <div className="flex items-center gap-4">
                                            <button
                                                className={`flex items-center gap-1 text-xs font-bold transition-colors ${user ? 'text-gray-400 hover:text-error' : 'text-gray-200 cursor-not-allowed'}`}
                                                onClick={(e) => { e.stopPropagation(); if (user) alert('Лайк поставлен!'); }}
                                                title={user ? 'Поставить лайк' : 'Войдите, чтобы ставить лайки'}
                                            >
                                                <Heart className={`w-4 h-4 ${user ? '' : 'opacity-20'}`} /> {post.likes_count || 0}
                                            </button>
                                            <button className="flex items-center gap-1 text-xs font-bold text-gray-400">
                                                <MessageCircle className="w-4 h-4" /> {post.comments_count || 0}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4 opacity-40 font-bold uppercase text-[10px]">
                                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                            {!post.hide_author && <span>Автор: {post.author_name || 'Admin'}</span>}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </main>

            <footer className="py-20 bg-[#2d3436] text-white mt-20 text-center">
                <p className="text-sm opacity-40">© 2026 POCKET DALE BLOG</p>
            </footer>
        </div>
    );
};

export default BlogPage;
