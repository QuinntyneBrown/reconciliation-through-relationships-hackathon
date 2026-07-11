export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// ──────────────────────────────────────────────────────────────────────────────
// Row types (returned by SELECT)
// ──────────────────────────────────────────────────────────────────────────────

export type ProfileRow = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  additional_matching_info: string | null;
  is_indigenous: boolean | null;
  sex: "male" | "female" | "prefer_not_to_say" | null;
  participation_categories: string[];
  city: string | null;
  province: string | null;
  treaty_area: string | null;
  faith_tradition:
    | "indigenous_traditional"
    | "atheist"
    | "christian"
    | "jewish"
    | "muslim"
    | "hindu"
    | "buddhist"
    | "other"
    | "prefer_not_to_say"
    | null;
  faith_tradition_other: string | null;
  interests: string[];
  availability: Json;
  participation_format: string[];
  language_preferences: string[];
  personal_boundaries: string | null;
  matching_preferences: Json;
  role: "participant" | "facilitator";
  onboarding_completed: boolean;
  learning_completed: boolean;
  map_consent: boolean;
  lat: number | null;
  lng: number | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type LearningModuleRow = {
  id: string;
  title: string;
  description: string | null;
  content_type: "video" | "text";
  content_url: string | null;
  content_body: string | null;
  duration_minutes: number;
  order_index: number;
  audience: "non_indigenous" | "indigenous" | "all";
  is_required: boolean;
  created_at: string;
};

export type LearningProgressRow = {
  id: string;
  user_id: string;
  module_id: string;
  completed: boolean;
  completed_at: string | null;
  time_spent_seconds: number;
  created_at: string;
};

export type MatchRow = {
  id: string;
  indigenous_participant_id: string;
  non_indigenous_participant_id: string;
  match_score: number | null;
  match_criteria: Json;
  status: "suggested" | "approved" | "rejected" | "connected";
  auto_generated: boolean;
  created_by: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
};

export type ConnectionRow = {
  id: string;
  match_id: string;
  participant_a_id: string;
  participant_b_id: string;
  participant_a_connected: boolean;
  participant_b_connected: boolean;
  connected_at: string | null;
  status: "pending" | "active";
  created_at: string;
};

export type MessageRow = {
  id: string;
  connection_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
};

export type MeetingRow = {
  id: string;
  connection_id: string;
  zoom_meeting_id: string | null;
  zoom_join_url: string | null;
  zoom_start_url: string | null;
  scheduled_at: string;
  duration_minutes: number;
  topic: string | null;
  created_by: string;
  created_at: string;
};

export type CohortRow = {
  id: string;
  name: string;
  city: string;
  province: string;
  facilitator_id: string;
  status: "forming" | "active";
  created_at: string;
};

export type CohortMemberRow = {
  id: string;
  cohort_id: string;
  participant_id: string;
  joined_at: string;
};

export type SystemSettingRow = {
  key: string;
  value: Json;
  updated_by: string | null;
  updated_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  type: "connect_request" | "match_approved" | "new_message" | "meeting_scheduled";
  title: string;
  body: string | null;
  data: Json;
  read: boolean;
  created_at: string;
};

// ──────────────────────────────────────────────────────────────────────────────
// Database shape (used to type Supabase client)
// ──────────────────────────────────────────────────────────────────────────────

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & { id: string };
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      learning_modules: {
        Row: LearningModuleRow;
        Insert: Omit<LearningModuleRow, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<LearningModuleRow, "id" | "created_at">>;
        Relationships: [];
      };
      learning_progress: {
        Row: LearningProgressRow;
        Insert: {
          id?: string;
          user_id: string;
          module_id: string;
          completed?: boolean;
          completed_at?: string | null;
          time_spent_seconds?: number;
        };
        Update: Partial<Omit<LearningProgressRow, "id" | "created_at">>;
        Relationships: [];
      };
      matches: {
        Row: MatchRow;
        Insert: {
          id?: string;
          indigenous_participant_id: string;
          non_indigenous_participant_id: string;
          match_score?: number | null;
          match_criteria?: Json;
          status?: "suggested" | "approved" | "rejected" | "connected";
          auto_generated?: boolean;
          created_by?: string | null;
          approved_by?: string | null;
          approved_at?: string | null;
        };
        Update: Partial<Omit<MatchRow, "id" | "created_at">>;
        Relationships: [];
      };
      connections: {
        Row: ConnectionRow;
        Insert: {
          id?: string;
          match_id: string;
          participant_a_id: string;
          participant_b_id: string;
          participant_a_connected?: boolean;
          participant_b_connected?: boolean;
          connected_at?: string | null;
          status?: "pending" | "active";
        };
        Update: Partial<Omit<ConnectionRow, "id" | "created_at">>;
        Relationships: [];
      };
      messages: {
        Row: MessageRow;
        Insert: {
          id?: string;
          connection_id: string;
          sender_id: string;
          content: string;
          read_at?: string | null;
        };
        Update: Partial<Omit<MessageRow, "id" | "created_at">>;
        Relationships: [];
      };
      meetings: {
        Row: MeetingRow;
        Insert: {
          id?: string;
          connection_id: string;
          zoom_meeting_id?: string | null;
          zoom_join_url?: string | null;
          zoom_start_url?: string | null;
          scheduled_at: string;
          duration_minutes?: number;
          topic?: string | null;
          created_by: string;
        };
        Update: Partial<Omit<MeetingRow, "id" | "created_at">>;
        Relationships: [];
      };
      cohorts: {
        Row: CohortRow;
        Insert: Omit<CohortRow, "id" | "created_at"> & { id?: string };
        Update: Partial<Omit<CohortRow, "id" | "created_at">>;
        Relationships: [];
      };
      cohort_members: {
        Row: CohortMemberRow;
        Insert: Omit<CohortMemberRow, "id" | "joined_at"> & { id?: string };
        Update: Partial<Omit<CohortMemberRow, "id" | "joined_at">>;
        Relationships: [];
      };
      system_settings: {
        Row: SystemSettingRow;
        Insert: SystemSettingRow;
        Update: Partial<SystemSettingRow>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: {
          id?: string;
          user_id: string;
          type: "connect_request" | "match_approved" | "new_message" | "meeting_scheduled";
          title: string;
          body?: string | null;
          data?: Json;
          read?: boolean;
        };
        Update: Partial<Omit<NotificationRow, "id" | "created_at">>;
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Convenience re-exports
export type Profile = ProfileRow;
export type LearningModule = LearningModuleRow;
export type LearningProgress = LearningProgressRow;
export type Match = MatchRow;
export type Connection = ConnectionRow;
export type Message = MessageRow;
export type Meeting = MeetingRow;
export type Cohort = CohortRow;
export type CohortMember = CohortMemberRow;
export type Notification = NotificationRow;
