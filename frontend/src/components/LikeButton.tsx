import React from 'react';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

interface LikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onToggleLike: () => void;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  disabled?: boolean;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  isLiked,
  likesCount,
  onToggleLike,
  size = 'medium',
  showCount = true,
  disabled = false,
  className = '',
}) => {
  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 18;
  
  return (
    <div className={`d-flex align-items-center gap-1 ${className}`}>
      <IconButton
        size={size}
        onClick={onToggleLike}
        disabled={disabled}
        className="p-1"
        style={{
          color: isLiked ? 'var(--color-error)' : 'var(--color-muted)',
          backgroundColor: 'transparent',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = isLiked 
              ? 'rgba(211, 47, 47, 0.1)' 
              : 'rgba(125, 114, 104, 0.1)';
          }
        }}
        onMouseLeave={(e) => {
          if (!disabled) {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        {isLiked ? (
          <FavoriteIcon style={{ fontSize: iconSize }} />
        ) : (
          <FavoriteBorderIcon style={{ fontSize: iconSize }} />
        )}
      </IconButton>
      {showCount && (
        <small 
          className="fw-medium" 
          style={{ 
            color: isLiked ? 'var(--color-error)' : 'var(--color-muted)',
            minWidth: '20px',
            textAlign: 'center'
          }}
        >
          {likesCount}
        </small>
      )}
    </div>
  );
};

export default LikeButton;