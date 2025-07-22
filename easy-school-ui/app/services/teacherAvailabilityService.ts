'use client';

import { v4 as uuid } from 'uuid';
import { CreateTeacherFormModel, TeacherWeekDayAvailableModel } from '@/app/lib/definitions/teacher_definitions';
import { CalendarWeekDayModel } from '@/app/lib/definitions/calendar_week_day_definitions';

export const addTeacherAvailability = (
  formData: CreateTeacherFormModel,
  currentAvailability: TeacherWeekDayAvailableModel[]
): { 
  success: boolean;
  message: string;
  updatedAvailability?: TeacherWeekDayAvailableModel[];
  resetData?: Partial<CreateTeacherFormModel>;
} => {
  if (!formData.week_day || formData.week_day.id === "") {
    return {
      success: false,
      message: "❌ Por favor, selecione um dia da semana."
    };
  }

  // Validate time inputs
  if (!formData.start_hour || !formData.start_minute || !formData.end_hour || !formData.end_minute) {
    return {
      success: false,
      message: "❌ Por favor, preencha todos os horários."
    };
  }

  const newAvailability: TeacherWeekDayAvailableModel = {
    uddi: uuid(),
    week_day: formData.week_day,
    start_hour: formData.start_hour,
    start_minute: formData.start_minute,
    end_hour: formData.end_hour,
    end_minute: formData.end_minute,
  };

  const updatedAvailability = [...currentAvailability, newAvailability];

  return {
    success: true,
    message: "✅ Disponibilidade adicionada com sucesso!",
    updatedAvailability,
    resetData: {
      week_day: undefined,
      start_hour: "",
      start_minute: "",
      end_hour: "",
      end_minute: "",
    }
  };
};

export const removeTeacherAvailability = (
  weekDayId: string,
  currentAvailability: TeacherWeekDayAvailableModel[]
): {
  success: boolean;
  message: string;
  updatedAvailability: TeacherWeekDayAvailableModel[];
} => {
  if (!weekDayId) {
    return {
      success: false,
      message: "❌ ID de disponibilidade inválido.",
      updatedAvailability: currentAvailability
    };
  }

  const updatedAvailability = currentAvailability.filter(item => item.uddi !== weekDayId);
  
  return {
    success: true,
    message: "✅ Disponibilidade removida com sucesso!",
    updatedAvailability
  };
};

export const formatAvailabilityForDisplay = (availability: TeacherWeekDayAvailableModel): string => {
  const weekDay = availability.week_day?.week_day || 'Unknown';
  const startTime = `${availability.start_hour?.padStart(2, '0')}:${availability.start_minute?.padStart(2, '0')}`;
  const endTime = `${availability.end_hour?.padStart(2, '0')}:${availability.end_minute?.padStart(2, '0')}`;
  
  return `${weekDay} - ${startTime} às ${endTime}`;
};

export const validateAvailabilityTime = (
  startHour: string, 
  startMinute: string, 
  endHour: string, 
  endMinute: string
): { valid: boolean; message?: string } => {
  const start = parseInt(startHour) * 60 + parseInt(startMinute);
  const end = parseInt(endHour) * 60 + parseInt(endMinute);
  
  if (isNaN(start) || isNaN(end)) {
    return { valid: false, message: "❌ Horários inválidos." };
  }
  
  if (end <= start) {
    return { valid: false, message: "❌ O horário de término deve ser após o horário de início." };
  }
  
  return { valid: true };
};