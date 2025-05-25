 
// eslint-disable-next-line react/prop-types
export default function BooleanToggle({ value, onChange }) {
  return (
    <div className="flex items-center space-x-4 ">
       <button
        onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full hover:bg-green-300 flex items-center px-1 transition-colors duration-300
          ${value ? "bg-green-500" : "bg-gray-300"}
        `}
      >
        <div
          className={`w-4 h-4 rounded-full hover:bg-green-200 bg-white shadow-md transform transition-transform duration-300
            ${value ? "translate-x-6" : "translate-x-0"}
          `}
        />
      </button>
      
    </div>
  );
}
