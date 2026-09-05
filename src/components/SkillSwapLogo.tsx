import React from 'react';
import logoAsset from '../assets/images/skillswap_logo_1788606818943.jpg';

interface SkillSwapLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const SkillSwapLogo: React.FC<SkillSwapLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const [imgError, setImgError] = React.useState(false);

  const logoSrc = !imgError ? (logoAsset || '/logo.jpg') : '/logo.jpg';

  const sizeMap = {
    sm: 'h-10 sm:h-12 w-auto max-h-14',
    md: 'w-36 sm:w-44 h-auto max-h-40',
    lg: 'w-48 sm:w-56 h-auto max-h-52',
    xl: 'w-64 sm:w-72 h-auto max-h-68',
  };

  const imgClass = sizeMap[size];

  return (
    <div className={`flex items-center justify-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="SkillSwap Logo"
        onError={() => setImgError(true)}
        className={`${imgClass} object-contain`}
      />
    </div>
  );
};
