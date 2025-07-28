import { CourseClassModel } from "@/app/lib/definitions/course_class_definitions";
import CourseClassSelector from "./CourseClassSelector";


interface ClassControleTableDesktopProps {
  classes: CourseClassModel[];
  selectedClassId: string;
  onClassChange: (value: string) => void;
}




export default function ClassControlTableDesktop({ 
  classes, 
  selectedClassId, 
  onClassChange 
}: ClassControleTableDesktopProps) {



     return (
        <>

        <CourseClassSelector
        classes={classes}
        onClassChange={onClassChange}
        selectedClassId=""
        />
        </>
     );
}