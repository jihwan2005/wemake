export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bookmarked_lesson: {
        Row: {
          lesson_id: string
          profile_id: string
        }
        Insert: {
          lesson_id: string
          profile_id: string
        }
        Update: {
          lesson_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookmarked_lesson_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "chapter_with_lessons_view"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "bookmarked_lesson_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "class_chapter_lesson"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "bookmarked_lesson_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_list_view"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "bookmarked_lesson_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "bookmarked_lesson_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "bookmarked_lesson_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      checked_goal: {
        Row: {
          goal_id: string
          profile_id: string
        }
        Insert: {
          goal_id: string
          profile_id: string
        }
        Update: {
          goal_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "checked_goal_goal_id_class_goals_goal_id_fk"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["goal_id"]
          },
          {
            foreignKeyName: "checked_goal_goal_id_class_goals_goal_id_fk"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "class_goals"
            referencedColumns: ["goal_id"]
          },
          {
            foreignKeyName: "checked_goal_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "checked_goal_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "checked_goal_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_Attendance: {
        Row: {
          class_post_id: number
          created_at: string | null
          date: string
          profile_id: string
        }
        Insert: {
          class_post_id: number
          created_at?: string | null
          date: string
          profile_id: string
        }
        Update: {
          class_post_id?: number
          created_at?: string | null
          date?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_Attendance_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_Attendance_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_Attendance_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_Attendance_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_Attendance_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_book: {
        Row: {
          book_id: number
          book_title: string
          class_post_id: number
          created_at: string | null
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          book_id?: never
          book_title: string
          class_post_id: number
          created_at?: string | null
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          book_id?: never
          book_title?: string
          class_post_id?: number
          created_at?: string | null
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_book_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_book_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_book_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_book_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_book_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_book_cover: {
        Row: {
          book_id: number
          cover_base64: string | null
        }
        Insert: {
          book_id: number
          cover_base64?: string | null
        }
        Update: {
          book_id?: number
          cover_base64?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_book_cover_book_id_class_book_book_id_fk"
            columns: ["book_id"]
            isOneToOne: true
            referencedRelation: "class_book"
            referencedColumns: ["book_id"]
          },
        ]
      }
      class_certificate: {
        Row: {
          class_post_id: number
          issued_at: string
          profile_id: string
        }
        Insert: {
          class_post_id: number
          issued_at?: string
          profile_id: string
        }
        Update: {
          class_post_id?: number
          issued_at?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_certificate_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_certificate_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_certificate_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_certificate_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_certificate_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_chapter: {
        Row: {
          chapter_id: string
          class_post_id: number
          order: number
          title: string | null
        }
        Insert: {
          chapter_id?: string
          class_post_id: number
          order?: number
          title?: string | null
        }
        Update: {
          chapter_id?: string
          class_post_id?: number
          order?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_chapter_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_chapter_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
        ]
      }
      class_chapter_lesson: {
        Row: {
          chapter_id: string
          is_hidden: boolean
          lesson_id: string
          order: number
          title: string | null
          video_url: string | null
        }
        Insert: {
          chapter_id: string
          is_hidden?: boolean
          lesson_id?: string
          order?: number
          title?: string | null
          video_url?: string | null
        }
        Update: {
          chapter_id?: string
          is_hidden?: boolean
          lesson_id?: string
          order?: number
          title?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_chapter_lesson_chapter_id_class_chapter_chapter_id_fk"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapter_with_lessons_view"
            referencedColumns: ["chapter_id"]
          },
          {
            foreignKeyName: "class_chapter_lesson_chapter_id_class_chapter_chapter_id_fk"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "class_chapter"
            referencedColumns: ["chapter_id"]
          },
        ]
      }
      class_dates: {
        Row: {
          class_post_id: number
          date: string
        }
        Insert: {
          class_post_id: number
          date: string
        }
        Update: {
          class_post_id?: number
          date?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_dates_class_post_id_fkey"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_dates_class_post_id_fkey"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
        ]
      }
      class_enrollments: {
        Row: {
          class_post_id: number
          enrolled_at: string
          enrollment_id: number
          profile_id: string
        }
        Insert: {
          class_post_id: number
          enrolled_at?: string
          enrollment_id?: never
          profile_id: string
        }
        Update: {
          class_post_id?: number
          enrolled_at?: string
          enrollment_id?: never
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_enrollments_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_enrollments_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_enrollments_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_enrollments_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_enrollments_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_goals: {
        Row: {
          class_post_id: number
          created_at: string
          goal_id: string
          goal_text: string
          profile_id: string
        }
        Insert: {
          class_post_id: number
          created_at?: string
          goal_id?: string
          goal_text: string
          profile_id: string
        }
        Update: {
          class_post_id?: number
          created_at?: string
          goal_id?: string
          goal_text?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_goals_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_goals_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_goals_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_goals_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_goals_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_message: {
        Row: {
          class_message_id: number
          class_message_room_id: number | null
          created_at: string
          is_delete: boolean
          is_edited: boolean
          is_read: boolean
          message_content: string
          read_at: string
          sender: string
        }
        Insert: {
          class_message_id?: never
          class_message_room_id?: number | null
          created_at?: string
          is_delete?: boolean
          is_edited?: boolean
          is_read?: boolean
          message_content: string
          read_at?: string
          sender: string
        }
        Update: {
          class_message_id?: never
          class_message_room_id?: number | null
          created_at?: string
          is_delete?: boolean
          is_edited?: boolean
          is_read?: boolean
          message_content?: string
          read_at?: string
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_message_class_message_room_id_class_message_rooms_class_m"
            columns: ["class_message_room_id"]
            isOneToOne: false
            referencedRelation: "class_message_rooms"
            referencedColumns: ["class_message_room_id"]
          },
          {
            foreignKeyName: "class_message_sender_profiles_profile_id_fk"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_message_sender_profiles_profile_id_fk"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_message_sender_profiles_profile_id_fk"
            columns: ["sender"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_message_images: {
        Row: {
          class_message_id: number | null
          class_message_room_id: number | null
          created_at: string | null
          image_url: string
          message_image_id: number
        }
        Insert: {
          class_message_id?: number | null
          class_message_room_id?: number | null
          created_at?: string | null
          image_url: string
          message_image_id?: never
        }
        Update: {
          class_message_id?: number | null
          class_message_room_id?: number | null
          created_at?: string | null
          image_url?: string
          message_image_id?: never
        }
        Relationships: [
          {
            foreignKeyName: "class_message_images_class_message_id_class_message_class_messa"
            columns: ["class_message_id"]
            isOneToOne: false
            referencedRelation: "class_message"
            referencedColumns: ["class_message_id"]
          },
          {
            foreignKeyName: "class_message_images_class_message_room_id_class_message_rooms_"
            columns: ["class_message_room_id"]
            isOneToOne: false
            referencedRelation: "class_message_rooms"
            referencedColumns: ["class_message_room_id"]
          },
        ]
      }
      class_message_room_members: {
        Row: {
          class_message_room_id: number
          created_at: string
          is_pinned: boolean
          profile_id: string
        }
        Insert: {
          class_message_room_id: number
          created_at?: string
          is_pinned?: boolean
          profile_id: string
        }
        Update: {
          class_message_room_id?: number
          created_at?: string
          is_pinned?: boolean
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_message_room_members_class_message_room_id_class_message_"
            columns: ["class_message_room_id"]
            isOneToOne: false
            referencedRelation: "class_message_rooms"
            referencedColumns: ["class_message_room_id"]
          },
          {
            foreignKeyName: "class_message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_message_room_notification: {
        Row: {
          class_message_room_id: number | null
          created_at: string
          notification_content: string
          notification_id: number
          notification_title: string
          profile_id: string | null
        }
        Insert: {
          class_message_room_id?: number | null
          created_at?: string
          notification_content: string
          notification_id?: never
          notification_title: string
          profile_id?: string | null
        }
        Update: {
          class_message_room_id?: number | null
          created_at?: string
          notification_content?: string
          notification_id?: never
          notification_title?: string
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_message_room_notification_class_message_room_id_class_mes"
            columns: ["class_message_room_id"]
            isOneToOne: false
            referencedRelation: "class_message_rooms"
            referencedColumns: ["class_message_room_id"]
          },
          {
            foreignKeyName: "class_message_room_notification_profile_id_profiles_profile_id_"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_message_room_notification_profile_id_profiles_profile_id_"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_message_room_notification_profile_id_profiles_profile_id_"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_message_rooms: {
        Row: {
          class_message_room_id: number
          created_at: string
        }
        Insert: {
          class_message_room_id?: never
          created_at?: string
        }
        Update: {
          class_message_room_id?: never
          created_at?: string
        }
        Relationships: []
      }
      class_mindmap: {
        Row: {
          class_post_id: number
          created_at: string | null
          mindmap_id: number
          mindmap_title: string
          profile_id: string
        }
        Insert: {
          class_post_id: number
          created_at?: string | null
          mindmap_id?: never
          mindmap_title: string
          profile_id: string
        }
        Update: {
          class_post_id?: number
          created_at?: string | null
          mindmap_id?: never
          mindmap_title?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_mindmap_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_mindmap_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_mindmap_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_mindmap_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_mindmap_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_mindmap_edge: {
        Row: {
          edge_id: string
          mindmap_id: number
          source_node_id: string
          target_node_id: string
        }
        Insert: {
          edge_id: string
          mindmap_id: number
          source_node_id: string
          target_node_id: string
        }
        Update: {
          edge_id?: string
          mindmap_id?: number
          source_node_id?: string
          target_node_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_mindmap_edge_mindmap_id_class_mindmap_mindmap_id_fk"
            columns: ["mindmap_id"]
            isOneToOne: false
            referencedRelation: "class_mindmap"
            referencedColumns: ["mindmap_id"]
          },
          {
            foreignKeyName: "class_mindmap_edge_source_node_id_class_mindmap_node_node_id_fk"
            columns: ["source_node_id"]
            isOneToOne: false
            referencedRelation: "class_mindmap_node"
            referencedColumns: ["node_id"]
          },
          {
            foreignKeyName: "class_mindmap_edge_target_node_id_class_mindmap_node_node_id_fk"
            columns: ["target_node_id"]
            isOneToOne: false
            referencedRelation: "class_mindmap_node"
            referencedColumns: ["node_id"]
          },
        ]
      }
      class_mindmap_node: {
        Row: {
          mindmap_id: number
          node_id: string
          node_label: string | null
          parent_id: string | null
          position_x: number
          position_y: number
        }
        Insert: {
          mindmap_id: number
          node_id: string
          node_label?: string | null
          parent_id?: string | null
          position_x: number
          position_y: number
        }
        Update: {
          mindmap_id?: number
          node_id?: string
          node_label?: string | null
          parent_id?: string | null
          position_x?: number
          position_y?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_mindmap_node_mindmap_id_class_mindmap_mindmap_id_fk"
            columns: ["mindmap_id"]
            isOneToOne: false
            referencedRelation: "class_mindmap"
            referencedColumns: ["mindmap_id"]
          },
          {
            foreignKeyName: "class_mindmap_node_parent_id_class_mindmap_node_node_id_fk"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "class_mindmap_node"
            referencedColumns: ["node_id"]
          },
        ]
      }
      class_mindmap_thumbnail: {
        Row: {
          mindmap_id: number
          thumbnail_base64: string
        }
        Insert: {
          mindmap_id: number
          thumbnail_base64: string
        }
        Update: {
          mindmap_id?: number
          thumbnail_base64?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_mindmap_thumbnail_mindmap_id_class_mindmap_mindmap_id_fk"
            columns: ["mindmap_id"]
            isOneToOne: true
            referencedRelation: "class_mindmap"
            referencedColumns: ["mindmap_id"]
          },
        ]
      }
      class_notifications: {
        Row: {
          class_post_id: number | null
          created_at: string
          enrollment_id: number | null
          lesson_id: string | null
          message_id: number | null
          notification_id: number
          notify_id: number | null
          seen: boolean
          source_id: string | null
          target_id: string
          type: Database["public"]["Enums"]["class_notification_type"]
        }
        Insert: {
          class_post_id?: number | null
          created_at?: string
          enrollment_id?: number | null
          lesson_id?: string | null
          message_id?: number | null
          notification_id?: never
          notify_id?: number | null
          seen?: boolean
          source_id?: string | null
          target_id: string
          type: Database["public"]["Enums"]["class_notification_type"]
        }
        Update: {
          class_post_id?: number | null
          created_at?: string
          enrollment_id?: number | null
          lesson_id?: string | null
          message_id?: number | null
          notification_id?: never
          notify_id?: number | null
          seen?: boolean
          source_id?: string | null
          target_id?: string
          type?: Database["public"]["Enums"]["class_notification_type"]
        }
        Relationships: [
          {
            foreignKeyName: "class_notifications_class_post_id_fkey"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_notifications_class_post_id_fkey"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_notifications_enrollment_id_class_enrollments_enrollment_"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "class_enrollments"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "class_notifications_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "chapter_with_lessons_view"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "class_notifications_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "class_chapter_lesson"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "class_notifications_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_list_view"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "class_notifications_message_id_class_message_class_message_id_f"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "class_message"
            referencedColumns: ["class_message_id"]
          },
          {
            foreignKeyName: "class_notifications_notify_id_class_notify_notify_id_fk"
            columns: ["notify_id"]
            isOneToOne: false
            referencedRelation: "class_notify"
            referencedColumns: ["notify_id"]
          },
          {
            foreignKeyName: "class_notifications_source_id_profiles_profile_id_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_notifications_source_id_profiles_profile_id_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_notifications_source_id_profiles_profile_id_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_notifications_target_id_profiles_profile_id_fk"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_notifications_target_id_profiles_profile_id_fk"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_notifications_target_id_profiles_profile_id_fk"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_notify: {
        Row: {
          class_post_id: number
          created_at: string
          notify_content: string | null
          notify_id: number
          notify_title: string
          profile_id: string
        }
        Insert: {
          class_post_id: number
          created_at?: string
          notify_content?: string | null
          notify_id?: never
          notify_title: string
          profile_id: string
        }
        Update: {
          class_post_id?: number
          created_at?: string
          notify_content?: string | null
          notify_id?: never
          notify_title?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_notify_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_notify_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_notify_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_notify_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_notify_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_posts: {
        Row: {
          class_post_id: number
          class_poster: string | null
          created_at: string
          description: string
          difficulty_type: Database["public"]["Enums"]["difficulty_type"]
          end_at: string
          field: string
          learners: number | null
          profile_id: string
          reviews: number | null
          start_at: string
          subtitle: string | null
          title: string
          updated_at: string
          upvotes: number | null
        }
        Insert: {
          class_post_id?: never
          class_poster?: string | null
          created_at?: string
          description: string
          difficulty_type: Database["public"]["Enums"]["difficulty_type"]
          end_at: string
          field: string
          learners?: number | null
          profile_id: string
          reviews?: number | null
          start_at: string
          subtitle?: string | null
          title: string
          updated_at?: string
          upvotes?: number | null
        }
        Update: {
          class_post_id?: never
          class_poster?: string | null
          created_at?: string
          description?: string
          difficulty_type?: Database["public"]["Enums"]["difficulty_type"]
          end_at?: string
          field?: string
          learners?: number | null
          profile_id?: string
          reviews?: number | null
          start_at?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "class_posts_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_posts_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_posts_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_quiz_answers: {
        Row: {
          answer_id: number
          answer_text: string | null
          choice_id: number | null
          confidence_level: Database["public"]["Enums"]["confidence_level_type"]
          question_id: number
          response_id: number
        }
        Insert: {
          answer_id?: never
          answer_text?: string | null
          choice_id?: number | null
          confidence_level?: Database["public"]["Enums"]["confidence_level_type"]
          question_id: number
          response_id: number
        }
        Update: {
          answer_id?: never
          answer_text?: string | null
          choice_id?: number | null
          confidence_level?: Database["public"]["Enums"]["confidence_level_type"]
          question_id?: number
          response_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_answers_choice_id_class_quiz_choices_choice_id_fk"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_choice_stats"
            referencedColumns: ["choice_id"]
          },
          {
            foreignKeyName: "class_quiz_answers_choice_id_class_quiz_choices_choice_id_fk"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_choices"
            referencedColumns: ["choice_id"]
          },
          {
            foreignKeyName: "class_quiz_answers_question_id_class_quiz_questions_question_id"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_descriptive_question_stats"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "class_quiz_answers_question_id_class_quiz_questions_question_id"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_questions"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "class_quiz_answers_response_id_class_quiz_responses_response_id"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_responses"
            referencedColumns: ["response_id"]
          },
        ]
      }
      class_quiz_choices: {
        Row: {
          choice_id: number
          choice_position: number | null
          choice_text: string
          is_correct: boolean
          question_id: number
        }
        Insert: {
          choice_id?: never
          choice_position?: number | null
          choice_text: string
          is_correct: boolean
          question_id: number
        }
        Update: {
          choice_id?: never
          choice_position?: number | null
          choice_text?: string
          is_correct?: boolean
          question_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_choices_question_id_class_quiz_questions_question_id"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_descriptive_question_stats"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "class_quiz_choices_question_id_class_quiz_questions_question_id"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_questions"
            referencedColumns: ["question_id"]
          },
        ]
      }
      class_quiz_images: {
        Row: {
          image_position: number | null
          image_url: string
          question_id: number
          quiz_image_id: number
        }
        Insert: {
          image_position?: number | null
          image_url: string
          question_id: number
          quiz_image_id?: never
        }
        Update: {
          image_position?: number | null
          image_url?: string
          question_id?: number
          quiz_image_id?: never
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_images_question_id_class_quiz_questions_question_id_"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_descriptive_question_stats"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "class_quiz_images_question_id_class_quiz_questions_question_id_"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_questions"
            referencedColumns: ["question_id"]
          },
        ]
      }
      class_quiz_manual_score: {
        Row: {
          answer_id: number
          score: number
          score_id: number
          score_reason: string | null
        }
        Insert: {
          answer_id: number
          score: number
          score_id?: never
          score_reason?: string | null
        }
        Update: {
          answer_id?: number
          score?: number
          score_id?: never
          score_reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_manual_score_answer_id_class_quiz_answers_answer_id_"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_answer_view"
            referencedColumns: ["answer_id"]
          },
          {
            foreignKeyName: "class_quiz_manual_score_answer_id_class_quiz_answers_answer_id_"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_answers"
            referencedColumns: ["answer_id"]
          },
        ]
      }
      class_quiz_questions: {
        Row: {
          question_hint: string | null
          question_id: number
          question_min_length: number | null
          question_point: number
          question_position: number | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          quiz_id: number
        }
        Insert: {
          question_hint?: string | null
          question_id?: never
          question_min_length?: number | null
          question_point?: number
          question_position?: number | null
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          quiz_id: number
        }
        Update: {
          question_hint?: string | null
          question_id?: never
          question_min_length?: number | null
          question_point?: number
          question_position?: number | null
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          quiz_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_questions_quiz_id_class_quizzes_quiz_id_fk"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "class_quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      class_quiz_responses: {
        Row: {
          profile_id: string
          quiz_id: number
          response_id: number
          submitted_at: string | null
        }
        Insert: {
          profile_id: string
          quiz_id: number
          response_id?: never
          submitted_at?: string | null
        }
        Update: {
          profile_id?: string
          quiz_id?: number
          response_id?: never
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_responses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_quiz_id_class_quizzes_quiz_id_fk"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "class_quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      class_quiz_score_dispute: {
        Row: {
          answer_id: number
          created_at: string | null
          dispute_id: number
          dispute_text: string
          profile_id: string
        }
        Insert: {
          answer_id: number
          created_at?: string | null
          dispute_id?: never
          dispute_text: string
          profile_id: string
        }
        Update: {
          answer_id?: number
          created_at?: string | null
          dispute_id?: never
          dispute_text?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_score_dispute_answer_id_class_quiz_answers_answer_id"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_answer_view"
            referencedColumns: ["answer_id"]
          },
          {
            foreignKeyName: "class_quiz_score_dispute_answer_id_class_quiz_answers_answer_id"
            columns: ["answer_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_answers"
            referencedColumns: ["answer_id"]
          },
          {
            foreignKeyName: "class_quiz_score_dispute_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_quiz_score_dispute_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_quiz_score_dispute_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_quiz_videos: {
        Row: {
          question_id: number
          quiz_video_id: number
          video_position: number | null
          video_url: string
        }
        Insert: {
          question_id: number
          quiz_video_id?: never
          video_position?: number | null
          video_url: string
        }
        Update: {
          question_id?: number
          quiz_video_id?: never
          video_position?: number | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_videos_question_id_class_quiz_questions_question_id_"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_descriptive_question_stats"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "class_quiz_videos_question_id_class_quiz_questions_question_id_"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_questions"
            referencedColumns: ["question_id"]
          },
        ]
      }
      class_quizzes: {
        Row: {
          class_post_id: number
          created_at: string | null
          end_time: string
          is_public: boolean
          profile_id: string
          quiz_description: string
          quiz_id: number
          quiz_title: string
          start_time: string
          time_limit_minutes: number | null
        }
        Insert: {
          class_post_id: number
          created_at?: string | null
          end_time: string
          is_public?: boolean
          profile_id: string
          quiz_description: string
          quiz_id?: never
          quiz_title: string
          start_time: string
          time_limit_minutes?: number | null
        }
        Update: {
          class_post_id?: number
          created_at?: string | null
          end_time?: string
          is_public?: boolean
          profile_id?: string
          quiz_description?: string
          quiz_id?: never
          quiz_title?: string
          start_time?: string
          time_limit_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "class_quizzes_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_quizzes_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_quizzes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_quizzes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_quizzes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_reviews: {
        Row: {
          class_post_id: number | null
          class_review_id: number
          created_at: string
          profile_id: string
          review: string
          updated_at: string
        }
        Insert: {
          class_post_id?: number | null
          class_review_id?: never
          created_at?: string
          profile_id: string
          review: string
          updated_at?: string
        }
        Update: {
          class_post_id?: number | null
          class_review_id?: never
          created_at?: string
          profile_id?: string
          review?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_reviews_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_reviews_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_reviews_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_reviews_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_reviews_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_showcase_images: {
        Row: {
          class_post_id: number
          created_at: string | null
          image_url: string
          showcase_image_id: number
        }
        Insert: {
          class_post_id: number
          created_at?: string | null
          image_url: string
          showcase_image_id?: never
        }
        Update: {
          class_post_id?: number
          created_at?: string | null
          image_url?: string
          showcase_image_id?: never
        }
        Relationships: [
          {
            foreignKeyName: "class_showcase_images_class_post_id_class_posts_class_post_id_f"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_showcase_images_class_post_id_class_posts_class_post_id_f"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
        ]
      }
      class_upvotes: {
        Row: {
          class_post_id: number
          profile_id: string
        }
        Insert: {
          class_post_id: number
          profile_id: string
        }
        Update: {
          class_post_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "class_upvotes_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_upvotes_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_upvotes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_upvotes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_upvotes_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      classPost_with_hashtags: {
        Row: {
          class_post_id: number
          hashtag_id: string
        }
        Insert: {
          class_post_id: number
          hashtag_id: string
        }
        Update: {
          class_post_id?: number
          hashtag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "classPost_with_hashtags_class_post_id_class_posts_class_post_id"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "classPost_with_hashtags_class_post_id_class_posts_class_post_id"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "classPost_with_hashtags_hashtag_id_hashtags_hashtag_id_fk"
            columns: ["hashtag_id"]
            isOneToOne: false
            referencedRelation: "hashtags"
            referencedColumns: ["hashtag_id"]
          },
        ]
      }
      completed_lesson: {
        Row: {
          lesson_id: string
          profile_id: string
        }
        Insert: {
          lesson_id: string
          profile_id: string
        }
        Update: {
          lesson_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "completed_lesson_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "chapter_with_lessons_view"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "completed_lesson_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "class_chapter_lesson"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "completed_lesson_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_list_view"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "completed_lesson_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "completed_lesson_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "completed_lesson_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string | null
          following_id: string | null
        }
        Insert: {
          created_at?: string
          follower_id?: string | null
          following_id?: string | null
        }
        Update: {
          created_at?: string
          follower_id?: string | null
          following_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follows_follower_id_profiles_profile_id_fk"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "follows_follower_id_profiles_profile_id_fk"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "follows_follower_id_profiles_profile_id_fk"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "follows_following_id_profiles_profile_id_fk"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "follows_following_id_profiles_profile_id_fk"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "follows_following_id_profiles_profile_id_fk"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      hashtags: {
        Row: {
          hashtag_id: string
          tag: string
        }
        Insert: {
          hashtag_id?: string
          tag: string
        }
        Update: {
          hashtag_id?: string
          tag?: string
        }
        Relationships: []
      }
      keyword_ranking: {
        Row: {
          keyword_frequency: number | null
          keyword_id: number
          keyword_text: string
        }
        Insert: {
          keyword_frequency?: number | null
          keyword_id?: never
          keyword_text: string
        }
        Update: {
          keyword_frequency?: number | null
          keyword_id?: never
          keyword_text?: string
        }
        Relationships: []
      }
      message_room_members: {
        Row: {
          created_at: string
          message_room_id: number
          profile_id: string
        }
        Insert: {
          created_at?: string
          message_room_id: number
          profile_id: string
        }
        Update: {
          created_at?: string
          message_room_id?: number
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_room_members_message_room_id_message_rooms_message_room"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["message_room_id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      message_rooms: {
        Row: {
          created_at: string
          message_room_id: number
        }
        Insert: {
          created_at?: string
          message_room_id?: never
        }
        Update: {
          created_at?: string
          message_room_id?: never
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          message_id: number
          message_room_id: number
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          message_id?: never
          message_room_id: number
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          message_id?: never
          message_room_id?: number
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_message_room_id_message_rooms_message_room_id_fk"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["message_room_id"]
          },
          {
            foreignKeyName: "messages_sender_id_profiles_profile_id_fk"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "messages_sender_id_profiles_profile_id_fk"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "messages_sender_id_profiles_profile_id_fk"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          headline: string | null
          name: string
          profile_id: string
          role: Database["public"]["Enums"]["role"]
          stats: Json | null
          updated_at: string
          username: string
          views: Json | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          headline?: string | null
          name: string
          profile_id: string
          role?: Database["public"]["Enums"]["role"]
          stats?: Json | null
          updated_at?: string
          username: string
          views?: Json | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          headline?: string | null
          name?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["role"]
          stats?: Json | null
          updated_at?: string
          username?: string
          views?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      bookmarked_lesson_list_view: {
        Row: {
          class_post_id: number | null
          lesson_id: string | null
          profile_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookmarked_lesson_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "chapter_with_lessons_view"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "bookmarked_lesson_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "class_chapter_lesson"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "bookmarked_lesson_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_list_view"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "bookmarked_lesson_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "bookmarked_lesson_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "bookmarked_lesson_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_chapter_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_chapter_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
        ]
      }
      certificate_view: {
        Row: {
          class_post_id: number | null
          class_title: string | null
          completion_duration: string | null
          completion_rank: number | null
          days_taken: number | null
          issued_at: string | null
          profile_id: string | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_certificate_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_certificate_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_certificate_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_certificate_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_certificate_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      chapter_with_lessons_view: {
        Row: {
          chapter_id: string | null
          chapter_title: string | null
          class_post_id: number | null
          is_completed: boolean | null
          is_hidden: boolean | null
          lesson_id: string | null
          lesson_title: string | null
          video_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_chapter_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_chapter_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
        ]
      }
      checked_goal_list_view: {
        Row: {
          author_username: string | null
          class_post_id: number | null
          created_at: string | null
          goal_id: string | null
          goal_text: string | null
          is_checked: boolean | null
          profile_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_goals_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_goals_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
        ]
      }
      class_attendance_with_status: {
        Row: {
          class_post_id: number | null
          date: string | null
          is_attended: boolean | null
          profile_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_Attendance_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_Attendance_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_Attendance_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_dates_class_post_id_fkey"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_dates_class_post_id_fkey"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
        ]
      }
      class_list_view: {
        Row: {
          author_avatar: string | null
          author_id: string | null
          author_username: string | null
          class_post_id: number | null
          class_poster: string | null
          created_at: string | null
          description: string | null
          difficulty_type: Database["public"]["Enums"]["difficulty_type"] | null
          end_at: string | null
          field: string | null
          hashtags: string[] | null
          is_enrolled: boolean | null
          is_reviewed: boolean | null
          is_upvoted: boolean | null
          learners: number | null
          reviews: number | null
          showcase_images: string[] | null
          start_at: string | null
          subtitle: string | null
          title: string | null
          upvotes: number | null
        }
        Relationships: []
      }
      class_messages_view: {
        Row: {
          avatar: string | null
          class_message_room_id: number | null
          is_pinned: boolean | null
          last_message: string | null
          last_message_created_at: string | null
          name: string | null
          other_profile_id: string | null
          profile_id: string | null
          unread_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "class_message_room_members_class_message_room_id_class_message_"
            columns: ["class_message_room_id"]
            isOneToOne: false
            referencedRelation: "class_message_rooms"
            referencedColumns: ["class_message_room_id"]
          },
          {
            foreignKeyName: "class_message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["other_profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["other_profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["other_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      class_quiz_answer_view: {
        Row: {
          answer_id: number | null
          answer_text: string | null
          choice_id: number | null
          choice_text: string | null
          confidence_level:
            | Database["public"]["Enums"]["confidence_level_type"]
            | null
          correct_choice_text: string | null
          dispute_text: string | null
          final_score: number | null
          is_correct: boolean | null
          is_correct_answer: boolean | null
          manual_score: number | null
          profile_id: string | null
          question_id: number | null
          question_point: number | null
          question_position: number | null
          question_text: string | null
          question_type: Database["public"]["Enums"]["question_type"] | null
          quiz_id: number | null
          response_id: number | null
          score_reason: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_answers_choice_id_class_quiz_choices_choice_id_fk"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_choice_stats"
            referencedColumns: ["choice_id"]
          },
          {
            foreignKeyName: "class_quiz_answers_choice_id_class_quiz_choices_choice_id_fk"
            columns: ["choice_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_choices"
            referencedColumns: ["choice_id"]
          },
          {
            foreignKeyName: "class_quiz_answers_question_id_class_quiz_questions_question_id"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_descriptive_question_stats"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "class_quiz_answers_question_id_class_quiz_questions_question_id"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_questions"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "class_quiz_answers_response_id_class_quiz_responses_response_id"
            columns: ["response_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_responses"
            referencedColumns: ["response_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_quiz_id_class_quizzes_quiz_id_fk"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "class_quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      class_quiz_choice_stats: {
        Row: {
          choice_id: number | null
          choice_position: number | null
          choice_text: string | null
          question_id: number | null
          selected_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_choices_question_id_class_quiz_questions_question_id"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_descriptive_question_stats"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "class_quiz_choices_question_id_class_quiz_questions_question_id"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_questions"
            referencedColumns: ["question_id"]
          },
        ]
      }
      class_quiz_descriptive_question_stats: {
        Row: {
          average_score: number | null
          confident_count: number | null
          max_score: number | null
          min_score: number | null
          question_id: number | null
          question_text: string | null
          quiz_id: number | null
          total_answers: number | null
          unanswered_count: number | null
          unsure_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_questions_quiz_id_class_quizzes_quiz_id_fk"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "class_quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      class_quiz_question_stats: {
        Row: {
          average_score: number | null
          confident_count: number | null
          correct_count: number | null
          descriptive_average_score: number | null
          question_id: number | null
          question_text: string | null
          quiz_id: number | null
          student_count: number | null
          total_answers: number | null
          unanswered_count: number | null
          unsure_count: number | null
          wrong_count: number | null
          wrong_rate_percent: number | null
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_answers_question_id_class_quiz_questions_question_id"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_descriptive_question_stats"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "class_quiz_answers_question_id_class_quiz_questions_question_id"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "class_quiz_questions"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_quiz_id_class_quizzes_quiz_id_fk"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "class_quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      class_quiz_student_scores: {
        Row: {
          profile_id: string | null
          quiz_id: number | null
          total_score: number | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_responses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_quiz_id_class_quizzes_quiz_id_fk"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "class_quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      class_quiz_written_answers_view: {
        Row: {
          answers: Json[] | null
          profile_id: string | null
          quiz_id: number | null
          username: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_quiz_responses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_quiz_responses_quiz_id_class_quizzes_quiz_id_fk"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "class_quizzes"
            referencedColumns: ["quiz_id"]
          },
        ]
      }
      completed_lesson_list_view: {
        Row: {
          class_post_id: number | null
          lesson_id: string | null
          profile_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_chapter_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_chapter_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "completed_lesson_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "chapter_with_lessons_view"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "completed_lesson_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "class_chapter_lesson"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "completed_lesson_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_list_view"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "completed_lesson_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "completed_lesson_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "completed_lesson_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      lesson_list_view: {
        Row: {
          chapter_id: string | null
          class_post_id: number | null
          is_bookmarked: boolean | null
          is_completed: boolean | null
          is_hidden: boolean | null
          lesson_id: string | null
          title: string | null
          video_url: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_chapter_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_chapter_class_post_id_class_posts_class_post_id_fk"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_chapter_lesson_chapter_id_class_chapter_chapter_id_fk"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapter_with_lessons_view"
            referencedColumns: ["chapter_id"]
          },
          {
            foreignKeyName: "class_chapter_lesson_chapter_id_class_chapter_chapter_id_fk"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "class_chapter"
            referencedColumns: ["chapter_id"]
          },
        ]
      }
      messages_view: {
        Row: {
          avatar: string | null
          last_message: string | null
          message_room_id: number | null
          name: string | null
          other_profile_id: string | null
          profile_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "message_room_members_message_room_id_message_rooms_message_room"
            columns: ["message_room_id"]
            isOneToOne: false
            referencedRelation: "message_rooms"
            referencedColumns: ["message_room_id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["other_profile_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["other_profile_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "message_room_members_profile_id_profiles_profile_id_fk"
            columns: ["other_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      notification_class_view: {
        Row: {
          class_post_id: number | null
          class_title: string | null
          created_at: string | null
          enrollment_id: number | null
          lesson_id: string | null
          message_id: number | null
          notification_id: number | null
          notify_id: number | null
          seen: boolean | null
          source_id: string | null
          target_id: string | null
          type: Database["public"]["Enums"]["class_notification_type"] | null
        }
        Relationships: [
          {
            foreignKeyName: "class_notifications_class_post_id_fkey"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_notifications_class_post_id_fkey"
            columns: ["class_post_id"]
            isOneToOne: false
            referencedRelation: "class_posts"
            referencedColumns: ["class_post_id"]
          },
          {
            foreignKeyName: "class_notifications_enrollment_id_class_enrollments_enrollment_"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "class_enrollments"
            referencedColumns: ["enrollment_id"]
          },
          {
            foreignKeyName: "class_notifications_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "chapter_with_lessons_view"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "class_notifications_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "class_chapter_lesson"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "class_notifications_lesson_id_class_chapter_lesson_lesson_id_fk"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lesson_list_view"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "class_notifications_message_id_class_message_class_message_id_f"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "class_message"
            referencedColumns: ["class_message_id"]
          },
          {
            foreignKeyName: "class_notifications_notify_id_class_notify_notify_id_fk"
            columns: ["notify_id"]
            isOneToOne: false
            referencedRelation: "class_notify"
            referencedColumns: ["notify_id"]
          },
          {
            foreignKeyName: "class_notifications_source_id_profiles_profile_id_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_notifications_source_id_profiles_profile_id_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_notifications_source_id_profiles_profile_id_fk"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_notifications_target_id_profiles_profile_id_fk"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "checked_goal_list_view"
            referencedColumns: ["profile_id"]
          },
          {
            foreignKeyName: "class_notifications_target_id_profiles_profile_id_fk"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "class_list_view"
            referencedColumns: ["author_id"]
          },
          {
            foreignKeyName: "class_notifications_target_id_profiles_profile_id_fk"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
    }
    Functions: {
      get_class_room: {
        Args: { sender: string; receiver: string }
        Returns: {
          class_message_room_id: number
        }[]
      }
      get_room: {
        Args: { from_user_id: string; to_user_id: string }
        Returns: {
          message_room_id: number
        }[]
      }
    }
    Enums: {
      class_notification_type:
        | "upload"
        | "upload-notify"
        | "enrollment"
        | "complete"
        | "complete-goal"
        | "message"
      confidence_level_type: "confident" | "unsure" | "unanswered"
      difficulty_type: "beginner" | "intermediate" | "advanced"
      difficulty_type_old: "beginner" | "Intermediate" | "advanced"
      notification_type: "follow" | "review" | "reply" | "mention"
      question_type: "multiple_choice" | "short_answer" | "long_answer"
      role:
        | "developer"
        | "designer"
        | "marketer"
        | "founder"
        | "product-manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      class_notification_type: [
        "upload",
        "upload-notify",
        "enrollment",
        "complete",
        "complete-goal",
        "message",
      ],
      confidence_level_type: ["confident", "unsure", "unanswered"],
      difficulty_type: ["beginner", "intermediate", "advanced"],
      difficulty_type_old: ["beginner", "Intermediate", "advanced"],
      notification_type: ["follow", "review", "reply", "mention"],
      question_type: ["multiple_choice", "short_answer", "long_answer"],
      role: ["developer", "designer", "marketer", "founder", "product-manager"],
    },
  },
} as const
