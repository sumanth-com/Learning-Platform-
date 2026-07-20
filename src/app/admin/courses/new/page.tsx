import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CourseForm } from "@/components/admin/forms/course-form";

export default function NewCoursePage() {
  return (
    <div>
      <AdminPageHeader
        title="New course"
        description="Create a course shell, then add phases and modules."
      />
      <CourseForm />
    </div>
  );
}
