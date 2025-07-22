import React from 'react';
import DateInput from '../DateInput';
import BRLCurrency from '../currency';

export function TeacherInfoComponent(props) {
  const { formData = {}, handleInputChange = () => {} } = props;
  
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
  
        <h2 className="text-base font-bold text-left mb-4 p-3 text-gray-800">Informações do Professor</h2>
        
        <div className="space-y-4">
          {/* Nome - Full width */}
          <div className="flex items-center justify-center">
            <div className="w-full flex items-center">
              <label className="w-24 text-sm text-right mr-3">Nome:</label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
            </div>
          </div>
          
          {/* Telefone and Email on same line */}
          <div className="flex items-center justify-center">
            <div className="w-full flex items-center">
              <label className="w-24 text-sm text-right mr-3">Telefone:</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number || ""}
                onChange={handleInputChange}
                className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
              />
              <label className="w-24 text-sm text-right mr-3">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
                className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {/* Salário and Data de início on same line */}
          <div className="flex items-center justify-center">
            <div className="w-full flex items-center">
              <label className="w-24 text-sm text-right mr-3">Hora/Aula:</label>
              <BRLCurrency onChange={handleInputChange} name='compensation' value={formData.name || ""} asInput 
              className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"/>

              <label className="w-34 text-sm text-right mr-3 pl-[22%]">Data de início:</label>
              <DateInput
                name="start_date"
                value={formData.start_date || ""}
                onChange={handleInputChange}
                className="flex-1 rounded-md border border-gray-300 py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}