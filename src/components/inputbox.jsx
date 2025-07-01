import React from 'react';

const Inputbox = React.forwardRef(
  ({ label, type = 'text', placeholder = ' ', icon, ...rest }, ref) => {
    return (
      <div className="relative w-full p-1">
        {icon && (
          <i className={`${icon} absolute right-2.5 top-5 text-gray-400`} />
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className="peer w-full h-[50px] bg-transparent border-b-2  border-black outline-none text-black text-[1rem] px-[5px] pr-[35px]"
          {...rest}
        />
  <label className="absolute left-[5px] text-black text-[1rem] transform transition-all duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-focus:top-[-5px]">
          {label}
        </label>
      </div>
    );
  }
);
export default Inputbox;