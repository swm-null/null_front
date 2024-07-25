import { motion } from 'framer-motion';

interface AnimatedHeaderProps {
  text: string;
  /**
   * leftMargin 설정 여부 토글
   */
  leftMarginToggle?: boolean;
  leftMargin?: number;
  /**
   * animationDuration: leftMargin 생기고 사라지는 애니메이션 duration. (단위: s)
   * 설정하고 싶은 경우 해당 파라미터 전달
   */
  animationDuration?: number;
}

/**
 * 화면 상단에 페이지에 대해 한 단어로 설명해주는 컴퍼넌트
 * ex) 메모 검색히기, 메모 추가하기
 * 왼쪽에 margin을 조절하는 애니메이션 설정할 수 있음
 */
const AnimatedHeader = ({
  text,
  leftMarginToggle,
  leftMargin = 48,
  animationDuration = 0,
}: AnimatedHeaderProps) => {
  if (leftMarginToggle !== undefined) {
    return (
      <motion.div
        className="flex px-4 py-4"
        initial={{ marginLeft: leftMarginToggle ? leftMargin : 0 }}
        animate={{ marginLeft: leftMarginToggle ? leftMargin : 0 }}
        transition={{
          duration: animationDuration,
        }}
      >
        <p className="font-semibold text-lg">{text}</p>
      </motion.div>
    );
  }

  // leftMarginToggle이 없을 경우 그냥 div return
  return (
    <div className="flex px-4 py-4">
      <p className="font-semibold text-lg">{text}</p>
    </div>
  );
};

export default AnimatedHeader;