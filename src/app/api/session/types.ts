
type LessonScore = {
  raw: string;
  min: string;
  max: string;
};

type LessonCore = {
  student_id: string;
  student_name: string;
  lesson_location: string;
  credit: string;
  lesson_status: string;
  entry: string;
  lesson_mode: string;
  exit: string;
  session_time: string;
  score: LessonScore;
  total_time: string;
};

type StudentData = {
  mastery_score: string;
  max_time_allowed: string;
  time_limit_action: string;
};

type StudentPreference = {
  audio: string;
  language: string;
  speed: string;
  text: string;
};

type CMI = {
  suspend_data: string;
  launch_data: string;
  comments: string;
  comments_from_lms: string;
  core: LessonCore;
  objectives: Record<string, unknown>;
  student_data: StudentData;
  student_preference: StudentPreference;
  interactions: Record<string, unknown>;
};

export type LMSCommitBody = { cmi: CMI }