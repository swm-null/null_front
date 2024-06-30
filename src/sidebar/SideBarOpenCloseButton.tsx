import * as React from "react";

const Path = (props: any) => (
  <path
    fill="transparent"
    strokeWidth="3"
    stroke="black"
    strokeLinecap="round"
    {...props}
  />
);

/**
 * 햄버거 버튼과 메뉴 닫기 버튼
 * @param toggle: () => void
 * @returns 
 */
export const SideBarOpenCloseButton = ({ handleClick }: {handleClick: ()=>void}) => (
  <button className='absolute top-1 left-2 w-12 h-12 rounded-[50%] grid justify-center items-center'
    onClick={handleClick}>
    <svg width="23" height="18" viewBox="0 0 23 18">
      <Path
        d="M 2 2.5 L 20 2.5"
        className="top"
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" }
        }}
      />
      <Path d="M 2 9.423 L 20 9.423" opacity="1" className="middle" />
      <Path
        d="M 2 16.346 L 20 16.346"
        className="bottom"
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" }
        }}
      />
    </svg>
  </button>
);
