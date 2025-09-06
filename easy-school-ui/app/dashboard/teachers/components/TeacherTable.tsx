import { TeacherModel } from '@/app/lib/definitions/teacher_definitions';
import TeacherTableMobile from './TeacherTableMobile';
import TeacherTableDesktop from "./TeacherTableDesktop";
import { bffApiClient } from "@/app/config/clientAPI";


const clientApi = bffApiClient.resource('/teachers');

export default function TeacherTable({
  query,
  currentPage,
  teachers,
}: {
  query: string;
  currentPage: number;
  teachers:TeacherModel[];
}) {
  
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        {/* Mobile View */}
        <div className="md:hidden">
          <TeacherTableMobile
            teachers={teachers}
          />
        </div>

        {/* Desktop View */}
        <div className="hidden md:block">
          <TeacherTableDesktop
            teachers={teachers}
          />
        </div>
      </div>
    </div>
  );
}