import angryImg from '@/data/Characters/ilias/angry.png';
import happyImg from '@/data/Characters/ilias/happy.png';
import normalImg from '@/data/Characters/ilias/normal.png';
import questionImg from '@/data/Characters/ilias/question.png';
import sadImg from '@/data/Characters/ilias/sad.png';

type Emotion = 'happy' | 'angry' | 'normal' | 'question' | 'sad';

interface MentorAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  emotion?: Emotion;
}

export const MentorAvatar: React.FC<MentorAvatarProps> = ({ size = 'md', emotion = 'normal' }) => {
  const sizeMap = { sm: 40, md: 60, lg: 80 };
  const imgSize = sizeMap[size] || 60;

  const emotionMap: Record<Emotion, string> = {
    happy: happyImg,
    angry: angryImg,
    normal: normalImg,
    question: questionImg,
    sad: sadImg,
  };

  return (
    <img
      src={emotionMap[emotion]}
      width={imgSize}
      height={imgSize}
      alt={emotion}
      className="rounded-full object-cover"
    />
  );
};