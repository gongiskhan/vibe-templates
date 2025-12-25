"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, MoreHorizontal, Trash2, Edit, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useBrand } from "@/brand/brand-provider"
import { t } from "@/i18n"

export interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: string
  updatedAt?: string
  replies?: Comment[]
  isEdited?: boolean
}

interface CommentThreadProps {
  comments: Comment[]
  currentUserId: string
  onAddComment?: (content: string, parentId?: string) => void
  onEditComment?: (id: string, content: string) => void
  onDeleteComment?: (id: string) => void
  className?: string
}

interface CommentItemProps {
  comment: Comment
  currentUserId: string
  depth?: number
  onReply?: (parentId: string) => void
  onEdit?: (id: string, content: string) => void
  onDelete?: (id: string) => void
  locale: "pt" | "en"
}

function CommentItem({
  comment,
  currentUserId,
  depth = 0,
  onReply,
  onEdit,
  onDelete,
  locale,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const isOwner = comment.author.id === currentUserId

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      if (diffInMinutes < 1) return t(locale, "activity.timeAgo.justNow")
      return t(locale, "activity.timeAgo.minutesAgo").replace("{{count}}", String(diffInMinutes))
    }

    if (diffInHours < 24) {
      return t(locale, "activity.timeAgo.hoursAgo").replace("{{count}}", String(diffInHours))
    }

    return date.toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      day: "2-digit",
      month: "short",
    })
  }

  const handleSaveEdit = () => {
    if (editContent.trim() && onEdit) {
      onEdit(comment.id, editContent)
      setIsEditing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex gap-3", depth > 0 && "ml-10")}
    >
      <Avatar className="h-8 w-8 shrink-0">
        {comment.author.avatar ? (
          <img src={comment.author.avatar} alt={comment.author.name} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-sm font-medium">
            {comment.author.name.charAt(0)}
          </div>
        )}
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{comment.author.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatTime(comment.createdAt)}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-muted-foreground">
                ({t(locale, "workflow.comments.edited")})
              </span>
            )}
          </div>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t(locale, "common.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete?.(comment.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t(locale, "common.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
              className="resize-none text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit}>
                {t(locale, "common.save")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsEditing(false)
                  setEditContent(comment.content)
                }}
              >
                {t(locale, "common.cancel")}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-sm">{comment.content}</p>
            {depth < 2 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto px-0 py-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => onReply?.(comment.id)}
              >
                <Reply className="mr-1 h-3 w-3" />
                {t(locale, "workflow.comments.reply")}
              </Button>
            )}
          </>
        )}

        {/* Nested replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-muted pl-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                depth={depth + 1}
                onReply={onReply}
                onEdit={onEdit}
                onDelete={onDelete}
                locale={locale}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function CommentThread({
  comments,
  currentUserId,
  onAddComment,
  onEditComment,
  onDeleteComment,
  className,
}: CommentThreadProps) {
  const { locale } = useBrand()
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!newComment.trim() || !onAddComment) return

    setIsSubmitting(true)
    await onAddComment(newComment, replyTo || undefined)
    setNewComment("")
    setReplyTo(null)
    setIsSubmitting(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Comment input */}
      <div className="space-y-2">
        {replyTo && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Reply className="h-4 w-4" />
            <span>{t(locale, "workflow.comments.replyingTo")}</span>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => setReplyTo(null)}
            >
              {t(locale, "common.cancel")}
            </Button>
          </div>
        )}
        <div className="flex gap-2">
          <Textarea
            placeholder={t(locale, "workflow.comments.placeholder")}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={2}
            className="flex-1 resize-none"
          />
          <Button
            onClick={handleSubmit}
            disabled={!newComment.trim() || isSubmitting}
            size="icon"
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {t(locale, "workflow.comments.hint")}
        </p>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={currentUserId}
              onReply={setReplyTo}
              onEdit={onEditComment}
              onDelete={onDeleteComment}
              locale={locale}
            />
          ))}
        </AnimatePresence>
      </div>

      {comments.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          {t(locale, "workflow.comments.empty")}
        </p>
      )}
    </div>
  )
}
