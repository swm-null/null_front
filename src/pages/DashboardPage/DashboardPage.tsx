import React from 'react';
import { AnimatedHeader, EditableTag } from 'components/ui';
import useOriginalMemoManager from './hook/useOriginalMemoManager';
import { dummyData } from './dummyData';
import { OriginalMemoList } from './components';
import { Divider } from '@mui/material';
import { HEADER_ANIMATION_DELAY, HEADER_ANIMATION_DURATION } from 'constants/HeaderSideBarAnimation';
import { tagInvalidCharsPattern } from 'constants/memo/TagRule';

export const DashboardPage = ({ headerLeftMarginToggle }: { headerLeftMarginToggle?: boolean }) => {
  const {
    viewMemos,
    tags,
    updateOriginalMemo,
    deleteOriginalMemo,
    handleTagClick
  } = useOriginalMemoManager({dummyData});


  return (
    <div className="flex flex-col flex-1 h-screen text-gray2">
      <AnimatedHeader
        text={'메모 대시보드'}
        leftMarginToggle={headerLeftMarginToggle}
        animationDuration={HEADER_ANIMATION_DURATION}
        toggleOnDurationDelay={HEADER_ANIMATION_DELAY}
      />

      {/* tag들 선택하는 부분 */}
      <div className='flex w-full px-4 gap-2 overflow-hidden'>
        <EditableTag text='모든 메모' invalidCharsPattern={tagInvalidCharsPattern} onClick={() => handleTagClick('all')}/>
        <Divider orientation='vertical'/>
        <div className='flex flex-1 overflow-hidden overflow-x-scroll'>
          <div className='flex flex-none gap-1 overflow-x-scroll'>
            {
              tags.map((tag, index) => 
                <EditableTag text={tag} invalidCharsPattern={tagInvalidCharsPattern} onClick={() => handleTagClick(tag)}/>
              )
            }
          </div>
        </div>
      </div>

      <div className="pb-4 px-4 flex flex-col flex-1 overflow-hidden">
        <OriginalMemoList originalMemos={viewMemos} updateOriginalMemo={updateOriginalMemo} deleteOriginalMemo={deleteOriginalMemo} />
      </div>
    </div>
  );
};
