import { redirect } from "next/navigation";
import {
  CURRICULUM_ROUTES,
  DEFAULT_COURSE_SLUG,
} from "@/features/curriculum/types";

/** /learn → default course learning workspace */
export default function LearnIndexRedirect() {
  redirect(CURRICULUM_ROUTES.learn(DEFAULT_COURSE_SLUG));
}
