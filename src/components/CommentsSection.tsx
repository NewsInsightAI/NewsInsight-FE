"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDarkMode } from "@/context/DarkModeContext";
import { useLanguage } from "@/context/LanguageContext";
import { TranslatedText } from "./TranslatedText";
import { formatTimestamp } from "@/utils/formatTimestamp";
import { useSession, signIn } from "next-auth/react";

interface Comment {
  id: number;
  user_id: number;
  news_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: {
    email: string;
    profile?: {
      full_name?: string;
      avatar?: string;
    };
  };
  replies?: Comment[];
}

interface CommentsSectionProps {
  newsId: number;
}

export default function CommentsSection({ newsId }: CommentsSectionProps) {
  const { isDark } = useDarkMode();
  const { currentLanguage } = useLanguage();
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");

  // Get user from session
  const user = session?.user
    ? {
        id: 1, // You might need to adjust this based on your user ID system
        email: session.user.email || "",
        profile: {
          full_name: session.user.name || undefined,
          avatar: session.user.image || undefined,
        },
      }
    : null;

  // Fetch comments
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/comments?newsId=${newsId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        // Transform backend data to match frontend interface
        const comments = data.data?.comments || data.data || [];
        const transformedComments = comments.map(
          (comment: {
            id: number;
            news_id: number;
            reader_name: string;
            reader_email: string;
            content: string;
            created_at: string;
            updated_at: string;
          }) => ({
            id: comment.id,
            user_id: comment.reader_email, // Use email as user identifier
            news_id: comment.news_id,
            content: comment.content,
            created_at: comment.created_at,
            updated_at: comment.updated_at,
            user: {
              email: comment.reader_email || "anonymous@example.com",
              profile: {
                full_name: comment.reader_name,
                avatar: undefined,
              },
            },
            replies: [], // TODO: Implement replies if needed
          })
        );
        setComments(transformedComments);
      } else {
        // Fallback to empty array if no comments or error
        setComments([]);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  }, [newsId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const commentData = {
        newsId: newsId,
        content: newComment,
        readerName: user.profile?.full_name || user.email.split("@")[0],
        readerEmail: user.email,
      };

      console.log("Submitting comment data:", commentData);

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.success) {
        // Transform the new comment to match frontend interface
        const newCommentData: Comment = {
          id: data.data.id,
          user_id: data.data.reader_email,
          news_id: data.data.news_id,
          content: data.data.content,
          created_at: data.data.created_at,
          updated_at: data.data.updated_at,
          user: {
            email: data.data.reader_email,
            profile: {
              full_name: data.data.reader_name,
              avatar: user.profile?.avatar,
            },
          },
          replies: [],
        };

        setComments((prev) => [newCommentData, ...prev]);
        setNewComment("");
      } else {
        throw new Error(data.error || "Failed to submit comment");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Gagal mengirim komentar. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: number) => {
    if (!replyContent.trim() || !user) return;

    try {
      // Simulated reply submission
      const replyData: Comment = {
        id: Date.now(),
        user_id: user.id,
        news_id: newsId,
        content: replyContent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: user,
        replies: [],
      };

      // Add reply to the parent comment
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === parentId
            ? { ...comment, replies: [...(comment.replies || []), replyData] }
            : comment
        )
      );

      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error submitting reply:", error);
      alert("Gagal mengirim balasan. Silakan coba lagi.");
    }
  };

  const getUserDisplayName = (comment: Comment) => {
    return comment.user.profile?.full_name || comment.user.email.split("@")[0];
  };

  const getUserAvatar = (comment: Comment) => {
    return comment.user.profile?.avatar || "/images/default_profile.png";
  };

  const getCurrentUserAvatar = () => {
    return user?.profile?.avatar || "/images/default_profile.png";
  };

  // Function to get user initials for letter avatar
  const getUserInitials = (displayName: string) => {
    const nameParts = displayName.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Avatar component with fallback to letter avatar
  const Avatar = ({
    src,
    alt,
    displayName,
    size = 40,
  }: {
    src: string;
    alt: string;
    displayName: string;
    size?: number;
  }) => {
    const [imageError, setImageError] = useState(false);

    if (imageError || !src || src === "/images/default_profile.png") {
      return (
        <div
          className={`flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold flex-shrink-0`}
          style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
          {getUserInitials(displayName)}
        </div>
      );
    }

    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="rounded-full object-cover flex-shrink-0"
        style={{
          width: size,
          height: size,
          minWidth: size,
          minHeight: size,
          maxWidth: size,
          maxHeight: size,
        }}
        onError={() => setImageError(true)}
      />
    );
  };

  if (loading) {
    return (
      <div
        className={`p-6 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="animate-pulse">
          <div
            className={`h-6 ${isDark ? "bg-gray-700" : "bg-gray-300"} rounded w-1/3 mb-4`}
          ></div>
          <div
            className={`h-4 ${isDark ? "bg-gray-700" : "bg-gray-300"} rounded w-full mb-2`}
          ></div>
          <div
            className={`h-4 ${isDark ? "bg-gray-700" : "bg-gray-300"} rounded w-3/4`}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}>
      <h3
        className={`text-xl font-bold mb-6 ${isDark ? "text-white" : "text-gray-900"}`}
      >
        <TranslatedText>Komentar</TranslatedText> ({comments.length})
      </h3>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex gap-3">
            <Avatar
              src={getCurrentUserAvatar()}
              alt="Your avatar"
              displayName={user.profile?.full_name || user.email.split("@")[0]}
              size={40}
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={
                  currentLanguage.code === "id"
                    ? "Tulis komentar Anda..."
                    : "Write your comment..."
                }
                className={`w-full p-3 rounded-lg border resize-none ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                rows={3}
                disabled={isSubmitting}
              />
              <div className="flex justify-between items-center mt-2">
                <span
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {newComment.length}/500
                </span>
                <button
                  type="submit"
                  disabled={
                    !newComment.trim() ||
                    isSubmitting ||
                    newComment.length > 500
                  }
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    !newComment.trim() ||
                    isSubmitting ||
                    newComment.length > 500
                      ? isDark
                        ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Icon icon="eos-icons:loading" className="w-4 h-4" />
                      <TranslatedText>Mengirim...</TranslatedText>
                    </div>
                  ) : (
                    <TranslatedText>Kirim Komentar</TranslatedText>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div
          className={`p-4 rounded-lg border-2 border-dashed mb-8 text-center ${
            isDark
              ? "border-gray-600 bg-gray-700"
              : "border-gray-300 bg-gray-100"
          }`}
        >
          <Icon
            icon="material-symbols:login"
            className={`w-8 h-8 mx-auto mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          />
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mb-3`}>
            <TranslatedText>
              Silakan masuk untuk memberikan komentar
            </TranslatedText>
          </p>
          <button
            onClick={() => signIn()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <TranslatedText>Masuk</TranslatedText>
          </button>
        </div>
      )}

      {/* Comments List */}
      {comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-4 rounded-lg ${isDark ? "bg-gray-700" : "bg-white"} border ${isDark ? "border-gray-600" : "border-gray-200"}`}
            >
              {/* Comment Header */}
              <div className="flex items-start gap-3 mb-3">
                <Avatar
                  src={getUserAvatar(comment)}
                  alt={`${getUserDisplayName(comment)} avatar`}
                  displayName={getUserDisplayName(comment)}
                  size={40}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {getUserDisplayName(comment)}
                    </span>
                    <span
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      {formatTimestamp(
                        comment.created_at,
                        currentLanguage.code
                      )}
                    </span>
                  </div>
                  <p
                    className={`${isDark ? "text-gray-300" : "text-gray-700"} leading-relaxed`}
                  >
                    {comment.content}
                  </p>
                </div>
              </div>

              {/* Comment Actions */}
              <div className="flex items-center gap-4 ml-13">
                <button
                  onClick={() =>
                    setReplyingTo(replyingTo === comment.id ? null : comment.id)
                  }
                  className={`flex items-center gap-1 text-sm ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"} transition-colors`}
                >
                  <Icon icon="material-symbols:reply" className="w-4 h-4" />
                  <TranslatedText>Balas</TranslatedText>
                </button>
                <button
                  className={`flex items-center gap-1 text-sm ${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"} transition-colors`}
                >
                  <Icon
                    icon="material-symbols:thumb-up-outline"
                    className="w-4 h-4"
                  />
                  <span>0</span>
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && user && (
                <div className="mt-4 ml-13">
                  <div className="flex gap-3">
                    <Avatar
                      src={getCurrentUserAvatar()}
                      alt="Your avatar"
                      displayName={
                        user.profile?.full_name || user.email.split("@")[0]
                      }
                      size={32}
                    />
                    <div className="flex-1">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder={
                          currentLanguage.code === "id"
                            ? "Tulis balasan Anda..."
                            : "Write your reply..."
                        }
                        className={`w-full p-2 rounded border resize-none ${
                          isDark
                            ? "bg-gray-600 border-gray-500 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                        rows={2}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => {
                            setReplyingTo(null);
                            setReplyContent("");
                          }}
                          className={`px-3 py-1 text-sm rounded transition-colors ${
                            isDark
                              ? "text-gray-400 hover:text-gray-300"
                              : "text-gray-600 hover:text-gray-700"
                          }`}
                        >
                          <TranslatedText>Batal</TranslatedText>
                        </button>
                        <button
                          onClick={() => handleReply(comment.id)}
                          disabled={!replyContent.trim()}
                          className={`px-3 py-1 text-sm rounded transition-all ${
                            !replyContent.trim()
                              ? isDark
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          <TranslatedText>Balas</TranslatedText>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-13 space-y-4">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`p-3 rounded-lg ${isDark ? "bg-gray-600" : "bg-gray-50"}`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar
                          src={getUserAvatar(reply)}
                          alt={`${getUserDisplayName(reply)} avatar`}
                          displayName={getUserDisplayName(reply)}
                          size={32}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`font-semibold text-sm ${isDark ? "text-white" : "text-gray-900"}`}
                            >
                              {getUserDisplayName(reply)}
                            </span>
                            <span
                              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                            >
                              {formatTimestamp(
                                reply.created_at,
                                currentLanguage.code
                              )}
                            </span>
                          </div>
                          <p
                            className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} leading-relaxed`}
                          >
                            {reply.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon
            icon="material-symbols:comment-outline"
            className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`}
          />
          <h4
            className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            <TranslatedText>Tidak ada komentar yang tersedia</TranslatedText>
          </h4>
          <p
            className={`text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}
          >
            <TranslatedText>
              Jadilah yang pertama memberikan komentar pada berita ini
            </TranslatedText>
          </p>
        </div>
      )}
    </div>
  );
}
