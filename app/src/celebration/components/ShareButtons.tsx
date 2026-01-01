import { useState } from "react";
import { Twitter, Linkedin, Facebook, Link2, Check, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  shareUrl: string;
  shareText: string;
  onShare?: (platform: string) => void;
  compact?: boolean;
}

const platforms = [
  {
    id: "twitter",
    name: "Twitter",
    icon: Twitter,
    color: "bg-[#1DA1F2]/10 border-[#1DA1F2]/30 text-[#1DA1F2] hover:bg-[#1DA1F2]/20",
    getUrl: (text: string, url: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-[#0A66C2]/10 border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/20",
    getUrl: (text: string, url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-[#1877F2]/10 border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2]/20",
    getUrl: (text: string, url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
  },
  {
    id: "reddit",
    name: "Reddit",
    icon: MessageCircle,
    color: "bg-[#FF4500]/10 border-[#FF4500]/30 text-[#FF4500] hover:bg-[#FF4500]/20",
    getUrl: (text: string, url: string) =>
      `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
  },
];

export function ShareButtons({
  shareUrl,
  shareText,
  onShare,
  compact = false,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: typeof platforms[0]) => {
    const url = platform.getUrl(shareText, shareUrl);
    window.open(url, "_blank", "width=600,height=400");
    onShare?.(platform.id);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onShare?.("link");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handleShare(platform)}
            className={`
              p-2 rounded-lg border transition-all duration-200
              ${platform.color}
            `}
            title={`Share on ${platform.name}`}
          >
            <platform.icon className="h-4 w-4" />
          </button>
        ))}
        <button
          onClick={handleCopyLink}
          className={`
            p-2 rounded-lg border transition-all duration-200
            ${copied
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : "bg-zinc-500/10 border-zinc-500/30 text-zinc-400 hover:bg-zinc-500/20"
            }
          `}
          title="Copy link"
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-400 text-center">Share your achievement</p>

      <div className="grid grid-cols-2 gap-2">
        {platforms.map((platform) => (
          <button
            key={platform.id}
            onClick={() => handleShare(platform)}
            className={`
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border
              transition-all duration-200 font-medium text-sm
              ${platform.color}
            `}
          >
            <platform.icon className="h-4 w-4" />
            {platform.name}
          </button>
        ))}
      </div>

      {/* Copy link button */}
      <button
        onClick={handleCopyLink}
        className={`
          w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border
          transition-all duration-200 font-medium text-sm
          ${copied
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-700/50"
          }
        `}
      >
        {copied ? (
          <>
            <Check className="h-4 w-4" />
            Copied!
          </>
        ) : (
          <>
            <Link2 className="h-4 w-4" />
            Copy Link
          </>
        )}
      </button>
    </div>
  );
}

export default ShareButtons;
