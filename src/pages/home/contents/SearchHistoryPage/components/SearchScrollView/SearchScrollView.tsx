import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { MemoSearchConversation } from 'pages/home/contents/@interfaces';
import { DownIcon } from 'assets/icons';
import { Slide, SvgIcon } from '@mui/material';

const SearchScrollView = ({
  searchConversations,
  children,
}: {
  searchConversations: MemoSearchConversation[];
  children: ReactNode;
}) => {
  // 버튼 클릭 시 스크롤 이동할 방향의 div에 설정하는 ref
  const scrollDirectionRef = useRef<HTMLDivElement>(null);
  const {
    ref: endOfScrollViewObserverRef,
    inView: endOfScrollViewObserverInView,
  } = useInView({
    threshold: 0,
    initialInView: true,
  });

  // 스크롤 아래로 이동하는 기능
  const scrollToRecent = useCallback(() => {
    if (!endOfScrollViewObserverInView && scrollDirectionRef.current) {
      scrollDirectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [endOfScrollViewObserverInView]);

  // 검색을 요청하거나, 서버로부터 검색 결과를 리턴 받을 경우 자동으로 아래로 이동
  useEffect(() => {
    scrollToRecent();
  }, [searchConversations, scrollToRecent]);

  return (
    <div className="relative flex flex-col flex-1 overflow-hidden">
      {/* 스크롤 아래로 이동하는 버튼 */}
      <Slide
        direction="up"
        in={!endOfScrollViewObserverInView}
        mountOnEnter
        unmountOnExit
      >
        <SvgIcon
          className="absolute self-center bottom-2 rounded-full bg-white ring-slate-900/5 drop-shadow-lg cursor-pointer"
          style={{ width: 40, height: 40 }}
          onClick={scrollToRecent}
        >
          <DownIcon />
        </SvgIcon>
      </Slide>
      <div className="flex flex-col-reverse px-2 overflow-y-scroll no-scrollbar flex-1">
        <div ref={endOfScrollViewObserverRef} />
        <div ref={scrollDirectionRef} />
        {children}
      </div>
    </div>
  );
};

export default SearchScrollView;
