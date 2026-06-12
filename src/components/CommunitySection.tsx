import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CommunityPost } from "../types";
import { 
  Heart, 
  MessageSquare, 
  Send, 
  Code, 
  User, 
  Sparkles, 
  PlusCircle, 
  MessageCircle 
} from "lucide-react";

interface CommunitySectionProps {
  posts: CommunityPost[];
  onAddPost: (content: string, codeSnippet?: string) => void;
  onAddComment: (postId: string, comment: string) => void;
  onLikePost: (postId: string) => void;
}

export default function CommunitySection({ posts, onAddPost, onAddComment, onLikePost }: CommunitySectionProps) {
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCode, setNewPostCode] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    onAddPost(newPostContent, newPostCode ? newPostCode : undefined);
    setNewPostContent("");
    setNewPostCode("");
    setShowCreateForm(false);
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    onAddComment(postId, text);
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
    setActiveCommentPostId(null);
  };

  return (
    <div className="space-y-6" id="community-view-wrapper">
      {/* Forum header section */}
      <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 p-6 md:p-8 rounded-[2rem] relative overflow-hidden shadow-xl shadow-zinc-950/20">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-yellow-400/5 blur-[80px] rounded-full" />
        <div className="relative z-10">
          <span className="text-[10px] text-yellow-400 font-mono font-bold tracking-widest block uppercase mb-1">
            Espaço de Trocas
          </span>
          <h3 className="text-lg font-black text-zinc-100 tracking-tight">
            Fórum da Comunidade JS
          </h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl leading-relaxed pb-1">
            Compartilhe trechos de código, tire dúvidas, comente dicas e evolua com outros aprendizes virtuais!
          </p>
        </div>

        <button
          onClick={() => setShowCreateForm(prev => !prev)}
          className="relative z-10 bg-yellow-400 hover:bg-yellow-350 text-zinc-950 font-extrabold px-5 py-3 text-xs rounded-2xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-yellow-400/20 transition-all shrink-0 uppercase tracking-wider"
          id="btn-toggle-post-creator"
        >
          <PlusCircle className="w-4 h-4" />
          Nova Postagem
        </button>
      </div>

      {/* Creation form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] shadow-xl"
          >
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-xs text-zinc-400 font-bold block mb-1.5 uppercase tracking-wider">
                  O que você quer compartilhar?
                </label>
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Escreva sua pergunta ou dica de estudo de JavaScript..."
                  className="w-full bg-zinc-950 text-zinc-200 border border-zinc-800 p-3.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-yellow-400/30"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-bold flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
                  <Code className="w-3.5 h-3.5 text-yellow-400" />
                  Código Opcional (Snippet):
                </label>
                <textarea
                  value={newPostCode}
                  onChange={(e) => setNewPostCode(e.target.value)}
                  placeholder="// Cole seu código JavaScript útil aqui..."
                  className="w-full bg-zinc-950 text-yellow-450 border border-zinc-800 p-3.5 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-yellow-400/30"
                  rows={4}
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-200 px-3 py-2 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-350 text-zinc-950 text-xs font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-md"
                >
                  PUBLICAR POSTAGEM
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feed list of posts */}
      <div className="space-y-5">
        {posts.map(post => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900 border border-zinc-800 p-6 rounded-[2rem] space-y-4 shadow-md"
          >
            {/* Header: Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${post.avatarColor || "bg-zinc-700"} flex items-center justify-center font-bold text-zinc-950 text-xs`}>
                  {post.author.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-200">{post.author}</span>
                    {post.userTitle && (
                      <span className="bg-zinc-950 border border-zinc-800 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded">
                        {post.userTitle}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono italic block mt-0.5">
                    {post.createdAt}
                  </span>
                </div>
              </div>

              <span className="text-[10px] text-zinc-500 font-mono select-none uppercase tracking-wider">
                📍 Grupo de Estudo
              </span>
            </div>

            {/* Content Body */}
            <p className="text-xs text-zinc-300 leading-relaxed font-normal">
              {post.content}
            </p>

            {/* Optional integrated syntax wrapper code block */}
            {post.codeSnippet && (
              <div className="bg-zinc-950 rounded-xl border border-zinc-800 p-3.5 font-mono text-xs text-yellow-500 overflow-x-auto">
                <pre><code>{post.codeSnippet}</code></pre>
              </div>
            )}

            {/* Interaction Row buttons */}
            <div className="flex items-center gap-4 pt-2 border-t border-zinc-800/80">
              <button
                onClick={() => onLikePost(post.id)}
                className={`flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                  post.hasLiked ? "text-rose-400" : "text-zinc-400 hover:text-zinc-200"
                }`}
                id={`like-post-${post.id}`}
              >
                <Heart className={`w-4 h-4 ${post.hasLiked ? "fill-rose-450" : ""}`} />
                {post.likes} Curtidas
              </button>

              <button
                onClick={() => setActiveCommentPostId(prev => prev === post.id ? null : post.id)}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 font-semibold cursor-pointer"
                id={`comment-toggle-${post.id}`}
              >
                <MessageSquare className="w-4 h-4" />
                {post.comments.length} Comentários
              </button>
            </div>

            {/* Comments List drawer */}
            <div className="space-y-3 bg-zinc-950/40 p-4 rounded-2xl border border-zinc-850/60">
              {post.comments.length > 0 && (
                <div className="space-y-3">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="text-xs flex gap-2 border-b border-zinc-800/40 pb-2.5 last:border-b-0 last:pb-0">
                      <div className={`w-5 h-5 rounded-full ${comment.avatarColor} shrink-0 flex items-center justify-center font-bold text-zinc-950 text-[10px]`}>
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-zinc-300">{comment.author}</span>
                          <span className="text-[9px] text-[#637280]">{comment.createdAt}</span>
                        </div>
                        <p className="text-[#a1b0be] leading-relaxed font-normal">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Active writing drawer comment */}
              {activeCommentPostId === post.id ? (
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => {
                      const text = e.target.value;
                      setCommentInputs(prev => ({ ...prev, [post.id]: text }));
                    }}
                    placeholder="Adicione um comentário construtivo..."
                    className="flex-1 bg-zinc-950 border border-zinc-800 text-zinc-200 text-xs px-3.5 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-400/20"
                    id={`comment-input-${post.id}`}
                  />
                  <button
                    onClick={() => handleCommentSubmit(post.id)}
                    className="bg-yellow-400 hover:bg-yellow-350 text-zinc-950 p-2 rounded-lg flex items-center justify-center cursor-pointer shrink-0"
                    id={`comment-submit-btn-${post.id}`}
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveCommentPostId(post.id)}
                  className="text-[11px] text-yellow-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Responder a esta publicação...
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
