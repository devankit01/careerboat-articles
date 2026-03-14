'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { WP_SITE_URL, decodeHtmlEntities } from '@/lib/wp';

type CommentsSectionProps = {
  postId: number;
};

type WPComment = {
  id: number;
  author_name?: string;
  date?: string;
  content?: {
    rendered?: string;
  };
};

const COMMENTS_API = `${WP_SITE_URL}/wp-json/wp/v2/comments`;

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<WPComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');

  const commentsUrl = useMemo(() => `${COMMENTS_API}?post=${postId}&per_page=20&orderby=date&order=desc`, [postId]);

  async function loadComments() {
    try {
      setLoading(true);
      const response = await fetch(commentsUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`Failed to fetch comments (${response.status})`);
      }
      const data = (await response.json()) as WPComment[];
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadComments();
  }, [commentsUrl]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!name.trim() || !email.trim() || !content.trim()) {
      setMessage('Please fill all fields.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(COMMENTS_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: postId,
          author_name: name,
          author_email: email,
          content
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        const errorMessage = (error as { message?: string })?.message || `Failed to submit comment (${response.status})`;
        throw new Error(errorMessage);
      }

      setName('');
      setEmail('');
      setContent('');
      setMessage('Comment submitted. It may appear after moderation.');
      await loadComments();
    } catch (error) {
      const fallback = 'Unable to submit comment. Check WordPress discussion settings/CORS.';
      setMessage(error instanceof Error ? error.message : fallback);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-[#e7ddcf] bg-white p-5 md:p-7">
      <h3 className="text-2xl font-bold">Comments</h3>

      <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="rounded-lg border border-[#ddd2c6] px-3 py-2 outline-none focus:ring-2 focus:ring-[#4f47e5]/30"
            required
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="rounded-lg border border-[#ddd2c6] px-3 py-2 outline-none focus:ring-2 focus:ring-[#4f47e5]/30"
            required
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment"
          className="min-h-[120px] rounded-lg border border-[#ddd2c6] px-3 py-2 outline-none focus:ring-2 focus:ring-[#4f47e5]/30"
          required
        />
        <div className="flex items-center gap-3">
          <button
            disabled={submitting}
            className="rounded-lg bg-[#4f47e5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3e36c9] disabled:opacity-70"
            type="submit"
          >
            {submitting ? 'Submitting...' : 'Post Comment'}
          </button>
          {message && <p className="text-sm text-clay">{decodeHtmlEntities(message)}</p>}
        </div>
      </form>

      <div className="mt-7 border-t border-[#efe4d8] pt-6">
        {loading ? (
          <p className="text-sm text-clay">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-clay">No comments yet.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <article key={comment.id} className="rounded-xl border border-[#efe4d8] bg-[#fffcf8] p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-ink">{decodeHtmlEntities(comment.author_name || 'Anonymous')}</p>
                  {comment.date && (
                    <p className="text-xs text-clay">
                      {new Date(comment.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  )}
                </div>
                <div
                  className="prose-content mt-3"
                  dangerouslySetInnerHTML={{ __html: comment.content?.rendered || '' }}
                />
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
