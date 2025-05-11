
import React from 'react';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin, Mail, Copy, Link, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  image?: string;
  className?: string;
  variant?: 'default' | 'subtle';
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  description = '',
  image = '',
  className = '',
  variant = 'default'
}) => {
  // Handle URL encoding of parameters
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedImage = encodeURIComponent(image);
  
  // Social media share URLs
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinShareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`;
  const emailShareUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
  
  // Function to open share dialog
  const openShareWindow = (url: string) => {
    window.open(url, 'share-dialog', 'width=800,height=600');
    return false;
  };
  
  // Function to copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        toast({
          title: "Link copied!",
          description: "The link has been copied to your clipboard.",
        });
      })
      .catch(err => {
        console.error('Failed to copy:', err);
        toast({
          title: "Failed to copy",
          description: "Could not copy the link to clipboard.",
          variant: "destructive"
        });
      });
  };
  
  // Determine button styling based on variant
  const buttonVariant = variant === 'subtle' ? 'ghost' : 'outline';
  const buttonSize = variant === 'subtle' ? 'sm' : 'default';
  const iconSize = variant === 'subtle' ? 16 : 18;
  
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <Button 
        variant={buttonVariant} 
        size={buttonSize}
        onClick={() => openShareWindow(facebookShareUrl)}
        aria-label="Share on Facebook"
      >
        <Facebook size={iconSize} />
        {variant !== 'subtle' && <span className="ml-2">Facebook</span>}
      </Button>
      
      <Button 
        variant={buttonVariant} 
        size={buttonSize}
        onClick={() => openShareWindow(twitterShareUrl)}
        aria-label="Share on Twitter"
      >
        <Twitter size={iconSize} />
        {variant !== 'subtle' && <span className="ml-2">Twitter</span>}
      </Button>
      
      <Button 
        variant={buttonVariant} 
        size={buttonSize}
        onClick={() => openShareWindow(linkedinShareUrl)}
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={iconSize} />
        {variant !== 'subtle' && <span className="ml-2">LinkedIn</span>}
      </Button>
      
      <Button 
        variant={buttonVariant} 
        size={buttonSize}
        onClick={() => window.location.href = emailShareUrl}
        aria-label="Share via Email"
      >
        <Mail size={iconSize} />
        {variant !== 'subtle' && <span className="ml-2">Email</span>}
      </Button>
      
      <Button 
        variant={buttonVariant} 
        size={buttonSize}
        onClick={copyToClipboard}
        aria-label="Copy Link"
      >
        <Copy size={iconSize} />
        {variant !== 'subtle' && <span className="ml-2">Copy Link</span>}
      </Button>
    </div>
  );
};

export default SocialShareButtons;
