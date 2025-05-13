import { LoaderCircle } from 'lucide-react';

const ComponentLoading = () => {
  return (
    <div className="flex items-center justify-center">
      <LoaderCircle size={20} className="animate-spin w-10 h-10 text-primary" />
      <span className="ml-3 text-sm font-medium text-primary">Loading...</span>
    </div>
  );
};

export default ComponentLoading;
