'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Maximize, Pause, Play, X } from 'lucide-react'

export function VideoCardPlayer({
  src,
  poster,
  title,
  caption,
  className = ''
}: {
  src: string
  poster?: string | null
  title?: string
  caption?: string
  className?: string
}) {
  const [playing, setPlaying] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const expandedVideoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      await video.play()
    } else {
      video.pause()
    }
  }

  const handleOpenExpand = () => {
    const currentVideo = videoRef.current
    const currentTime = currentVideo ? currentVideo.currentTime : 0
    const wasPlaying = currentVideo ? !currentVideo.paused : false

    // Pause the inline video
    if (currentVideo && !currentVideo.paused) {
      currentVideo.pause()
    }

    setIsExpanded(true)
    document.body.style.overflow = 'hidden'

    setTimeout(() => {
      const expandedVideo = expandedVideoRef.current
      if (expandedVideo) {
        expandedVideo.currentTime = currentTime
        if (wasPlaying) {
          expandedVideo.play().catch(() => {})
        }
      }
    }, 100)
  }

  const handleCloseExpand = useCallback(() => {
    const expandedVideo = expandedVideoRef.current
    const currentTime = expandedVideo ? expandedVideo.currentTime : 0
    const wasPlaying = expandedVideo ? !expandedVideo.paused : false

    // Pause expanded video
    if (expandedVideo && !expandedVideo.paused) {
      expandedVideo.pause()
    }

    // Sync back to inline video
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime
      if (wasPlaying) {
        videoRef.current.play().catch(() => {})
      }
    }

    setIsExpanded(false)
    document.body.style.overflow = ''
  }, [])

  // Close on Escape key
  useEffect(() => {
    if (!isExpanded) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseExpand()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isExpanded, handleCloseExpand])

  return (
    <>
      {/* Inline player inside the card */}
      <div className={`project-video-player ${className}`}>
        <video
          ref={videoRef}
          className="project-video"
          src={src}
          poster={poster ?? undefined}
          preload="metadata"
          playsInline
          controls
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          onContextMenu={(e) => e.preventDefault()}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setVideoError(true)}
          aria-label={`Vídeo: ${title ?? 'Projeto'}`}
        />

        {!playing && !videoError && (
          <button
            className="video-play-overlay"
            type="button"
            onClick={togglePlay}
            aria-label={`Iniciar vídeo ${title ?? ''}`}
          >
            <Play fill="currentColor" aria-hidden="true" />
          </button>
        )}

        {!videoError && (
          <button
            className="video-fullscreen-button"
            type="button"
            onClick={handleOpenExpand}
            title="Ampliar vídeo"
            aria-label={`Ampliar vídeo ${title ?? ''}`}
          >
            <Maximize aria-hidden="true" />
          </button>
        )}

        {videoError && (
          <div className="video-unavailable">Não foi possível carregar este vídeo.</div>
        )}
      </div>

      {/* Expanded modal — centered floating card with blurred background */}
      {isExpanded && (
        <div
          className="video-expand-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Vídeo ampliado: ${title ?? 'Projeto'}`}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) handleCloseExpand()
          }}
        >
          <div className="video-expand-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-expand-close"
              type="button"
              onClick={handleCloseExpand}
              aria-label="Fechar vídeo ampliado"
            >
              <X aria-hidden="true" />
            </button>

            <div className="video-expand-media">
              <video
                ref={expandedVideoRef}
                src={src}
                poster={poster ?? undefined}
                preload="metadata"
                playsInline
                autoPlay
                controls
                controlsList="nodownload noplaybackrate"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                aria-label={`Vídeo ampliado: ${title ?? 'Projeto'}`}
              />
            </div>

            {(title || caption) && (
              <div className="video-expand-info">
                {title && <h3>{title}</h3>}
                {caption && <p>{caption}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
