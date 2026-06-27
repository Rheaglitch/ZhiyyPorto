export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          long_description: string | null;
          tech_stack: string[];
          image_url: string | null;
          live_url: string | null;
          github_url: string | null;
          featured: boolean;
          order_index: number;
          category: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          long_description?: string | null;
          tech_stack?: string[];
          image_url?: string | null;
          live_url?: string | null;
          github_url?: string | null;
          featured?: boolean;
          order_index?: number;
          category?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          long_description?: string | null;
          tech_stack?: string[];
          image_url?: string | null;
          live_url?: string | null;
          github_url?: string | null;
          featured?: boolean;
          order_index?: number;
          category?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          level: number;
          icon: string | null;
          order_index: number;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          level?: number;
          icon?: string | null;
          order_index?: number;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          level?: number;
          icon?: string | null;
          order_index?: number;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Convenience types
export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
