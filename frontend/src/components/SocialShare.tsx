import { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ShareIcon from '@mui/icons-material/Share';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import LinkIcon from '@mui/icons-material/Link';
import './SocialShare.css';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
  hashtags?: string[];
  className?: string;
}

const SocialShare = ({ 
  title, 
  url, 
  description = '', 
  hashtags = [], 
  className = '' 
}: SocialShareProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const hashtagsString = hashtags.map(tag => `#${tag}`).join(' ');

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=${hashtags.join(',')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle} ${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };

  const handleShare = (platform: string) => {
    window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      setShowOptions(!showOptions);
    }
  };

  return (
    <div className={`social-share-container ${className}`}>
      <Button
        variant="outline-primary"
        className="share-trigger-btn"
        onClick={handleNativeShare}
      >
        <ShareIcon className="share-icon" />
        <span>Share</span>
      </Button>

      {showOptions && !navigator.share && (
        <div className="share-options-dropdown">
          <div className="share-options-header">
            <h6>Share this post</h6>
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowOptions(false)}
              className="close-btn"
            >
              ×
            </Button>
          </div>

          <div className="share-buttons-grid">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Share on Facebook</Tooltip>}
            >
              <Button
                variant="outline-primary"
                className="share-btn facebook"
                onClick={() => handleShare('facebook')}
              >
                <FacebookIcon />
                <span>Facebook</span>
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Share on Twitter</Tooltip>}
            >
              <Button
                variant="outline-info"
                className="share-btn twitter"
                onClick={() => handleShare('twitter')}
              >
                <TwitterIcon />
                <span>Twitter</span>
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Share on LinkedIn</Tooltip>}
            >
              <Button
                variant="outline-primary"
                className="share-btn linkedin"
                onClick={() => handleShare('linkedin')}
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Share on WhatsApp</Tooltip>}
            >
              <Button
                variant="outline-success"
                className="share-btn whatsapp"
                onClick={() => handleShare('whatsapp')}
              >
                <WhatsAppIcon />
                <span>WhatsApp</span>
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Share on Telegram</Tooltip>}
            >
              <Button
                variant="outline-info"
                className="share-btn telegram"
                onClick={() => handleShare('telegram')}
              >
                <TelegramIcon />
                <span>Telegram</span>
              </Button>
            </OverlayTrigger>

            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>{copied ? 'Copied!' : 'Copy Link'}</Tooltip>}
            >
              <Button
                variant={copied ? "success" : "outline-secondary"}
                className="share-btn copy-link"
                onClick={handleCopyLink}
              >
                <LinkIcon />
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </Button>
            </OverlayTrigger>
          </div>

          {hashtags.length > 0 && (
            <div className="share-hashtags">
              <small>Suggested hashtags: {hashtagsString}</small>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SocialShare;