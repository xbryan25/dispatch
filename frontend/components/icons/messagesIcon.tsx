interface IconProps {
  className?: string;
}

export const MessagesIcon = ({ className }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} fill-none stroke-current`}
      strokeWidth="1.91"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18.68,8.16V15.8a2.86,2.86,0,0,1-2.86,2.86H13.91v2.86L8.18,18.66H4.36A2.86,2.86,0,0,1,1.5,15.8V8.16A2.86,2.86,0,0,1,4.36,5.3H15.82A2.86,2.86,0,0,1,18.68,8.16Z" />
      <path d="M18.68,14.84h1A2.86,2.86,0,0,0,22.5,12V4.34a2.86,2.86,0,0,0-2.86-2.86H8.18A2.86,2.86,0,0,0,5.32,4.34v1" />
      <line x1="5.32" y1="10.07" x2="14.86" y2="10.07" />
      <line x1="5.32" y1="13.89" x2="14.86" y2="13.89" />
    </svg>
  );
};
