'use client';

import { ShoppingBagIcon } from '@heroicons/react/24/outline';

interface CourseNameInputProps {
  courseName: string;
  onNameChange: (value: string) => void;
}

export default function CourseNameInput({ courseName, onNameChange }: CourseNameInputProps) {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(e.target.value);
  };

  return (
    <div className="mb-4">
      {/* Desktop view */}
      <div className="hidden md:block">
        <div className="w-full border-b py-3 text-sm">
          <div className="font-medium mb-2">Nome do Curso:</div>
          <div>
            <input
              type="text"
              name="name"
              id="name"
              value={courseName}
              onChange={handleChange}
              className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <label htmlFor="name-mobile" className="block text-sm font-medium mb-1">
          Nome do Curso:
        </label>
        <div className="relative">
          <input
            type="text"
            name="name"
            id="name-mobile"
            value={courseName}
            onChange={handleChange}
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            placeholder="Digite o nome do curso"
          />
          <ShoppingBagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
        </div>
      </div>
    </div>
  );
}