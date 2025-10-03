
const Button = ({ id, title, rightIcon, leftIcon, containerClass }) => {
    return (
      <button
        id={id}
        className={`group relative z-10 flex items-center gap-2 w-fit cursor-pointer overflow-hidden rounded-full px-7 py-3 text-black ${containerClass}`}
      >
        {leftIcon}
  
        <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
          {title}
        </span>
  
        {rightIcon}
      </button>
    );
  };
  
  export default Button;
  