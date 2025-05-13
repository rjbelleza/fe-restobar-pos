import { LoaderCircle } from 'lucide-react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <LoaderCircle className="animate-spin w-10 h-10 text-primary" />
      <span className="ml-3 text-lg font-medium text-gray-700">Loading...</span>
    </div>
  );
};

export default Loading;
