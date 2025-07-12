export const Button = ({ children, ...props }) => (
  <button
    {...props}
    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
  >
    {children}
  </button>
);
