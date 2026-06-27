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
      project_categories: {
        Row: {
          id: string;
          name: string;
          order_index: number;
        };
        Insert: {
          id?: string;
          name: string;
          order_index?: number;
        };
        Update: {
          id?: string;
          name?: string;
          order_index?: number;
        };
      };
      project_images: {
        Row: {
          id: string;
          project_id: string;
          storage_path: string;
          url: string;
          order_index: number;
        };
        Insert: {
          id?: string;
          project_id: string;
          storage_path: string;
          url: string;
          order_index?: number;
        };
        Update: {
          id?: string;
          project_id?: string;
          storage_path?: string;
          url?: string;
          order_index?: number;
        };
      };
      projects: {
        Row: {
          id: string;
          created_at: string;
          title: string;
          description: string;
          long_description: string | null;
          tech_stack: string[];
          live_url: string | null;
          github_url: string | null;
          featured: boolean;
          order_index: number;
          category_id: string;
          video_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          title: string;
          description: string;
          long_description?: string | null;
          tech_stack?: string[];
          live_url?: string | null;
          github_url?: string | null;
          featured?: boolean;
          order_index?: number;
          category_id: string;
          video_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          title?: string;
          description?: string;
          long_description?: string | null;
          tech_stack?: string[];
          live_url?: string | null;
          github_url?: string | null;
          featured?: boolean;
          order_index?: number;
          category_id?: string;
          video_url?: string | null;
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
      site_settings: {
        Row: {
          key: string;
          value: Record<string, unknown>;
        };
        Insert: {
          key: string;
          value: Record<string, unknown>;
        };
        Update: {
          key?: string;
          value?: Record<string, unknown>;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ============================================
// Convenience types
// ============================================
export type Project         = Database["public"]["Tables"]["projects"]["Row"];
export type ProjectCategory = Database["public"]["Tables"]["project_categories"]["Row"];
export type ProjectImage    = Database["public"]["Tables"]["project_images"]["Row"];
export type Skill           = Database["public"]["Tables"]["skills"]["Row"];

// Type gabungan untuk query dengan relasi (joins)
export type ProjectWithRelations = Project & {
  project_categories: ProjectCategory;
  project_images: ProjectImage[];
};

// Type untuk admin list (hanya butuh nama category)
export type ProjectWithCategory = Project & {
  project_categories: { name: string } | null;
};

// ============================================
// Helper functions
// ============================================

/**
 * Ekstrak YouTube video ID dari berbagai format URL YouTube.
 * Mendukung: watch, youtu.be, embed
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;

  // Format: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watchMatch) return watchMatch[1];

  // Format: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (shortMatch) return shortMatch[1];

  // Format: https://www.youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embedMatch) return embedMatch[1];

  return null;
}

/**
 * Validasi apakah URL adalah URL YouTube yang valid.
 * Konsisten dengan extractYouTubeId — returns true iff extractYouTubeId returns non-null.
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}
