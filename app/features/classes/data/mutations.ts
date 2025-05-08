import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "database.types";
type DifficultyType = Database["public"]["Enums"]["difficulty_type"];

export const createClass = async (
  client: SupabaseClient<Database>,
  {
    title,
    subtitle,
    description,
    start_at,
    end_at,
    field,
    difficulty_type,
    poster,
    userId,
  }: {
    title: string;
    subtitle: string;
    description: string;
    start_at: string;
    end_at: string;
    userId: string;
    field: string;
    difficulty_type: DifficultyType;
    poster: string;
  }
) => {
  const { data, error } = await client
    .from("class_posts")
    .insert({
      title,
      subtitle,
      description,
      class_poster: poster,
      profile_id: userId,
      start_at,
      end_at,
      field,
      difficulty_type,
    })
    .select()
    .single();
  if (error) {
    throw error;
  }
  return data;
};

export const createShowcaseImage = async (
  client: SupabaseClient<Database>,
  { classId, showcaseUrl }: { classId: number; showcaseUrl: string }
) => {
  const { data, error } = await client.from("class_showcase_images").insert({
    class_post_id: classId,
    image_url: showcaseUrl,
  });
  if (error) throw error;
  return data;
};

export const deleteClass = async (
  client: SupabaseClient<Database>,
  {
    classId,
    posterUrl,
    showcaseUrl,
  }: { classId: string; posterUrl: string; showcaseUrl: string[] }
) => {
  function extractPosterPath(url: string): string {
    return url.replace(
      "https://trwxbnzdoifmjxezpanj.supabase.co/storage/v1/object/public/poster/",
      ""
    );
  }

  function extractShowcasePath(url: string): string {
    return url.replace(
      "https://trwxbnzdoifmjxezpanj.supabase.co/storage/v1/object/public/showcase/",
      ""
    );
  }
  const posterPath = extractPosterPath(posterUrl);
  const showcaseImgPaths = showcaseUrl.map(extractShowcasePath);
  if (showcaseImgPaths.length > 0) {
    const { error: showcaseError } = await client.storage
      .from("showcase")
      .remove(showcaseImgPaths);
    if (showcaseError) throw showcaseError;
  }
  const { error: posterError } = await client.storage
    .from("poster")
    .remove([posterPath]);

  if (posterError) throw posterError;
  const { data, error } = await client
    .from("class_posts")
    .delete()
    .eq("class_post_id", Number(classId));
  if (error) throw error;
  return data;
};

export const updateClass = async (
  client: SupabaseClient<Database>,
  {
    title,
    description,
    start_at,
    end_at,
    field,
    difficulty_type,
    poster,
    classId,
  }: {
    title: string;
    description: string;
    start_at: string;
    end_at: string;
    field: string;
    difficulty_type: DifficultyType;
    poster: string;
    classId: string;
  }
) => {
  const { data, error } = await client
    .from("class_posts")
    .update({
      title,
      description,
      class_poster: poster,
      start_at,
      end_at,
      field,
      difficulty_type,
    })
    .eq("class_post_id", Number(classId));
  if (error) {
    throw error;
  }
  return data;
};

export const createChapter = async (
  client: SupabaseClient<Database>,
  { chapter, classId }: { chapter: string; classId: string }
) => {
  const { data, error } = await client
    .from("class_chapter")
    .insert({
      title: chapter,
      class_post_id: Number(classId),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteChapter = async (
  client: SupabaseClient<Database>,
  { chapterId }: { chapterId: string }
) => {
  const { data, error } = await client
    .from("class_chapter")
    .delete()
    .eq("chapter_id", chapterId)
    .single();
  if (error) throw error;
  return data;
};

export const updateChapter = async (
  client: SupabaseClient<Database>,
  {
    chapterId,
    title,
    order,
  }: { chapterId: string; title: string; order: string }
) => {
  const { data, error } = await client
    .from("class_chapter")
    .update({ title, order: Number(order) })
    .eq("chapter_id", chapterId)
    .single();
  if (error) throw error;
  return data;
};

export const createLesson = async (
  client: SupabaseClient<Database>,
  {
    lesson,
    chapterId,
    video,
    isHidden,
  }: {
    lesson: string;
    chapterId: string;
    video: string | null;
    isHidden: boolean;
  }
) => {
  const { data, error } = await client
    .from("class_chapter_lesson")
    .insert({
      title: lesson,
      chapter_id: chapterId,
      video_url: video,
      is_hidden: isHidden,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteLesson = async (
  client: SupabaseClient<Database>,
  { lessonId }: { lessonId: string }
) => {
  const { data, error } = await client
    .from("class_chapter_lesson")
    .delete()
    .eq("lesson_id", lessonId)
    .single();
  if (error) throw error;
  return data;
};

export const updateLesson = async (
  client: SupabaseClient<Database>,
  {
    lessonId,
    title,
    order,
    isHidden,
  }: { lessonId: string; title: string; order: string; isHidden: boolean }
) => {
  const { data, error } = await client
    .from("class_chapter_lesson")
    .update({ title, order: Number(order), is_hidden: isHidden })
    .eq("lesson_id", lessonId)
    .single();
  if (error) throw error;
  return data;
};

export const updateAllLessonHiddenProp = async (
  client: SupabaseClient<Database>,
  { chapterId, isHidden }: { chapterId: string; isHidden: boolean }
) => {
  const { data, error } = await client
    .from("class_chapter_lesson")
    .update({ is_hidden: isHidden })
    .eq("chapter_id", chapterId)
    .select();
  if (error) throw error;
  return data;
};

export const toggleEnrollment = async (
  client: SupabaseClient<Database>,
  { classId, userId }: { classId: string; userId: string }
) => {
  const { count } = await client
    .from("class_enrollments")
    .select("*", { count: "exact", head: true })
    .eq("class_post_id", Number(classId))
    .eq("profile_id", userId);
  if (count === 0) {
    await client.from("class_enrollments").insert({
      class_post_id: Number(classId),
      profile_id: userId,
    });
  } else {
    await client
      .from("class_enrollments")
      .delete()
      .eq("class_post_id", Number(classId))
      .eq("profile_id", userId);
  }
};

export const toggleUpvote = async (
  client: SupabaseClient<Database>,
  { classId, userId }: { classId: string; userId: string }
) => {
  const { count } = await client
    .from("class_upvotes")
    .select("*", { count: "exact", head: true })
    .eq("class_post_id", Number(classId))
    .eq("profile_id", userId);
  if (count === 0) {
    await client.from("class_upvotes").insert({
      class_post_id: Number(classId),
      profile_id: userId,
    });
  } else {
    await client
      .from("class_upvotes")
      .delete()
      .eq("class_post_id", Number(classId))
      .eq("profile_id", userId);
  }
};

export const createReview = async (
  client: SupabaseClient<Database>,
  {
    classId,
    userId,
    review,
  }: { classId: number; userId: string; review: string }
) => {
  const { data, error } = await client
    .from("class_reviews")
    .insert({
      class_post_id: classId,
      profile_id: userId,
      review: review,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteReview = async (
  client: SupabaseClient<Database>,
  { reviewId }: { reviewId: string }
) => {
  const { data, error } = await client
    .from("class_reviews")
    .delete()
    .eq("class_review_id", Number(reviewId))
    .single();
  if (error) throw error;
  return data;
};

export const updateReview = async (
  client: SupabaseClient<Database>,
  { reviewId, review }: { reviewId: string; review: string }
) => {
  const { data, error } = await client
    .from("class_reviews")
    .update({ review })
    .eq("class_review_id", Number(reviewId))
    .single();
  if (error) throw error;
  return data;
};

export async function createHashtagIfNotExists(
  client: SupabaseClient<Database>,
  tag: string
) {
  const { data, error } = await client
    .from("hashtags")
    .select("*")
    .eq("tag", tag)
    .maybeSingle();

  if (error) throw error;

  if (data) return data;

  const { data: inserted, error: insertError } = await client
    .from("hashtags")
    .insert({ tag })
    .select()
    .single();

  if (insertError) throw insertError;

  return inserted;
}

export async function linkHashtagToClass(
  client: SupabaseClient<Database>,
  class_post_id: number,
  hashtag_id: string
) {
  const { error } = await client.from("classPost_with_hashtags").insert({
    class_post_id,
    hashtag_id,
  });

  if (error) throw error;
}

export async function updateClassHashtags(
  client: SupabaseClient<Database>,
  classId: number,
  newTags: string[]
) {
  const { data: existingLinks, error: fetchError } = await client
    .from("classPost_with_hashtags")
    .select("hashtag_id, hashtags(tag)")
    .eq("class_post_id", classId);
  if (fetchError) throw fetchError;

  const existingTags = new Map(
    (existingLinks ?? []).map((link) => [
      link.hashtags.tag.toLowerCase(),
      link.hashtag_id,
    ])
  );

  const newTagSet = new Set(newTags.map((tag) => tag.toLowerCase()));

  for (const tag of newTags) {
    const lowerTag = tag.toLowerCase();
    if (!existingTags.has(lowerTag)) {
      const { data: tagData, error } = await client
        .from("hashtags")
        .upsert({ tag: lowerTag }, { onConflict: "tag" })
        .select()
        .single();
      if (error) throw error;

      await client.from("classPost_with_hashtags").insert({
        class_post_id: classId,
        hashtag_id: tagData.hashtag_id,
      });
    }
  }

  for (const [tagName, hashtagId] of existingTags.entries()) {
    if (!newTagSet.has(tagName)) {
      await client
        .from("classPost_with_hashtags")
        .delete()
        .eq("class_post_id", classId)
        .eq("hashtag_id", hashtagId);
    }
  }
}

export const createKeyword = async (
  client: SupabaseClient<Database>,
  { keyword }: { keyword: string }
) => {
  const normalizedKeyword = keyword.trim().replace(/\s+/g, "").toLowerCase();

  const { data: existing, error: fetchError } = await client
    .from("keyword_ranking")
    .select("*")
    .eq("keyword_text", normalizedKeyword)
    .maybeSingle();

  if (fetchError) throw fetchError;

  if (existing) {
    const { data: updated, error: updateError } = await client
      .from("keyword_ranking")
      .update({ keyword_frequency: (existing.keyword_frequency ?? 0) + 1 })
      .eq("keyword_id", existing.keyword_id)
      .select()
      .single();

    if (updateError) throw updateError;
    return updated;
  } else {
    const { data: inserted, error: insertError } = await client
      .from("keyword_ranking")
      .insert({
        keyword_text: normalizedKeyword,
        keyword_frequency: 1,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return inserted;
  }
};

export const toggleBookMark = async (
  client: SupabaseClient<Database>,
  { lessonId, userId }: { lessonId: string; userId: string }
) => {
  const { count } = await client
    .from("bookmarked_lesson")
    .select("*", { count: "exact", head: true })
    .eq("lesson_id", lessonId)
    .eq("profile_id", userId);
  if (count === 0) {
    await client.from("bookmarked_lesson").insert({
      lesson_id: lessonId,
      profile_id: userId,
    });
  } else {
    await client
      .from("bookmarked_lesson")
      .delete()
      .eq("lesson_id", lessonId)
      .eq("profile_id", userId);
  }
};

export const toggleComplete = async (
  client: SupabaseClient<Database>,
  { lessonId, userId }: { lessonId: string; userId: string }
) => {
  const { count } = await client
    .from("completed_lesson")
    .select("*", { count: "exact", head: true })
    .eq("lesson_id", lessonId)
    .eq("profile_id", userId);
  if (count === 0) {
    await client.from("completed_lesson").insert({
      lesson_id: lessonId,
      profile_id: userId,
    });
  } else {
    await client
      .from("completed_lesson")
      .delete()
      .eq("lesson_id", lessonId)
      .eq("profile_id", userId);
  }
};

export const createGoal = async (
  client: SupabaseClient<Database>,
  { classId, text, userId }: { classId: string; text: string; userId: string }
) => {
  const { data, error } = await client
    .from("class_goals")
    .insert({
      class_post_id: Number(classId),
      goal_text: text,
      profile_id: userId,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteGoal = async (
  client: SupabaseClient<Database>,
  { goalId }: { goalId: string }
) => {
  const { data, error } = await client
    .from("class_goals")
    .delete()
    .eq("goal_id", goalId)
    .single();
  if (error) throw error;
  return data;
};

export const updateGoal = async (
  client: SupabaseClient<Database>,
  { goalId, text }: { goalId: string; text: string }
) => {
  const { data, error } = await client
    .from("class_goals")
    .update({
      goal_text: text,
    })
    .eq("goal_id", goalId)
    .single();
  if (error) throw error;
  return data;
};

export const toggleCheck = async (
  client: SupabaseClient<Database>,
  { goalId, userId }: { goalId: string; userId: string }
) => {
  const { count } = await client
    .from("checked_goal")
    .select("*", { count: "exact", head: true })
    .eq("goal_id", goalId)
    .eq("profile_id", userId);
  if (count === 0) {
    await client.from("checked_goal").insert({
      goal_id: goalId,
      profile_id: userId,
    });
  } else {
    await client
      .from("checked_goal")
      .delete()
      .eq("goal_id", goalId)
      .eq("profile_id", userId);
  }
};

export const toggleAttendance = async (
  client: SupabaseClient<Database>,
  { classId, userId, date }: { classId: string; userId: string; date: string }
) => {
  const { data, error } = await client
    .from("class_Attendance")
    .insert({
      class_post_id: Number(classId),
      profile_id: userId,
      date: date,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const seeClassNotification = async (
  client: SupabaseClient<Database>,
  { userId, notificationId }: { userId: string; notificationId: string }
) => {
  const { error } = await client
    .from("class_notifications")
    .update({ seen: true })
    .eq("notification_id", Number(notificationId))
    .eq("target_id", userId);
  if (error) {
    throw error;
  }
};

export const deleteClassNotification = async (
  client: SupabaseClient<Database>,
  { userId, notificationId }: { userId: string; notificationId: string }
) => {
  const { error } = await client
    .from("class_notifications")
    .delete()
    .eq("notification_id", Number(notificationId))
    .eq("target_id", userId);
  if (error) {
    throw error;
  }
};

export const createClassNotify = async (
  client: SupabaseClient<Database>,
  { userId, text, classId }: { userId: string; text: string; classId: string }
) => {
  const { data, error } = await client
    .from("class_notify")
    .insert({
      profile_id: userId,
      notify_title: text,
      class_post_id: Number(classId),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateClassNotify = async (
  client: SupabaseClient<Database>,
  {
    title,
    content,
    notifyId,
  }: { title: string; content: string | null; notifyId: string }
) => {
  const { data, error } = await client
    .from("class_notify")
    .update({
      notify_title: title,
      notify_content: content,
    })
    .eq("notify_id", Number(notifyId))
    .single();
  if (error) throw error;
  return data;
};

export const deleteClassNotify = async (
  client: SupabaseClient<Database>,
  { notifyId }: { notifyId: string }
) => {
  const { data, error } = await client
    .from("class_notify")
    .delete()
    .eq("notify_id", Number(notifyId))
    .single();
  if (error) throw error;
  return data;
};

export const sendClassMessage = async (
  client: SupabaseClient<Database>,
  {
    sender,
    receiver,
    message_content,
  }: {
    sender: string;
    receiver: string;
    message_content: string;
  }
) => {
  const { data, error } = await client
    .rpc("get_class_room", {
      sender,
      receiver,
    })
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (data?.class_message_room_id) {
    const { error: messageInsertError } = await client
      .from("class_message")
      .insert({
        class_message_room_id: data.class_message_room_id,
        sender,
        message_content,
      });
    if (messageInsertError) {
      console.error("Message Insert Error:", messageInsertError);
      throw messageInsertError;
    }
    return data.class_message_room_id;
  } else {
    const { data: roomData, error: roomError } = await client
      .from("class_message_rooms")
      .insert({})
      .select("class_message_room_id")
      .single();
    if (roomError) {
      throw roomError;
    }
    await client.from("class_message_room_members").insert([
      {
        class_message_room_id: roomData.class_message_room_id,
        profile_id: sender,
      },
      {
        class_message_room_id: roomData.class_message_room_id,
        profile_id: receiver,
      },
    ]);
    const { error: messageInsertError } = await client
      .from("class_message")
      .insert({
        class_message_room_id: roomData.class_message_room_id,
        sender,
        message_content,
      });
    if (messageInsertError) {
      console.error("Message Insert Error:", messageInsertError);
      throw messageInsertError;
    }
    return roomData.class_message_room_id;
  }
};

export const deleteClassMessage = async (
  client: SupabaseClient<Database>,
  { messageId }: { messageId: string }
) => {
  const { data, error } = await client
    .from("class_message")
    .update({
      is_delete: true,
    })
    .eq("class_message_id", Number(messageId))
    .single();
  if (error) throw error;
  return data;
};

export const restoreClassMessage = async (
  client: SupabaseClient<Database>,
  { messageId }: { messageId: string }
) => {
  const { data, error } = await client
    .from("class_message")
    .update({
      is_delete: false,
    })
    .eq("class_message_id", Number(messageId))
    .single();
  if (error) throw error;
  return data;
};

export const updateClassMessage = async (
  client: SupabaseClient<Database>,
  { messageId, messageContent }: { messageId: string; messageContent: string }
) => {
  const { data, error } = await client
    .from("class_message")
    .update({
      message_content: messageContent,
      is_edited: true,
    })
    .eq("class_message_id", Number(messageId))
    .single();
  if (error) throw error;
  return data;
};

export const pinclassMessageRooms = async (
  client: SupabaseClient<Database>,
  { roomId, userId }: { roomId: string; userId: string }
) => {
  const { data, error } = await client
    .from("class_message_room_members")
    .select("is_pinned")
    .eq("class_message_room_id", Number(roomId))
    .eq("profile_id", userId)
    .single();
  if (!data || error) return;
  await client
    .from("class_message_room_members")
    .update({ is_pinned: !data.is_pinned })
    .eq("class_message_room_id", Number(roomId))
    .eq("profile_id", userId);
};

export const createMessageImage = async (
  client: SupabaseClient<Database>,
  {
    roomId,
    messageImageUrl,
    messageId,
  }: { roomId: string; messageImageUrl: string; messageId: number }
) => {
  const { data, error } = await client.from("class_message_images").insert({
    class_message_room_id: Number(roomId),
    image_url: messageImageUrl,
    class_message_id: messageId,
  });
  if (error) throw error;
  return data;
};

export const createClassQuiz = async (
  client: SupabaseClient<Database>,
  {
    classId,
    userId,
    title,
    description,
    startDate,
    endDate,
    limitTime,
  }: {
    classId: string;
    userId: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    limitTime: string;
  }
) => {
  const { data, error } = await client
    .from("class_quizzes")
    .insert({
      class_post_id: Number(classId),
      profile_id: userId,
      quiz_title: title,
      quiz_description: description,
      start_time: startDate,
      end_time: endDate,
      time_limit_minutes: Number(limitTime),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateClassQuizPublic = async (
  client: SupabaseClient<Database>,
  { quizId, userId }: { quizId: string; userId: string }
) => {
  const { data, error } = await client
    .from("class_quizzes")
    .select("is_public")
    .eq("quiz_id", Number(quizId))
    .eq("profile_id", userId)
    .single();
  if (!data || error) return;
  await client
    .from("class_quizzes")
    .update({ is_public: !data.is_public })
    .eq("quiz_id", Number(quizId))
    .eq("profile_id", userId);
};

export const createQuizQuestion = async (
  client: SupabaseClient<Database>,
  {
    quizId,
    text,
    point,
    type,
    position,
    choices,
    hint,
    minLength,
  }: {
    quizId: string;
    hint: string;
    text: string;
    point: string;
    type: "multiple_choice" | "short_answer" | "long_answer";
    position: string;
    choices: { choice_text: string; position: number; is_correct: boolean }[];
    minLength: string;
  }
) => {
  const { data, error } = await client
    .from("class_quiz_questions")
    .insert({
      quiz_id: Number(quizId),
      question_text: text,
      question_type: type,
      question_hint: hint,
      question_point: Number(point),
      question_position: Number(position),
      question_min_length: Number(minLength),
    })
    .select()
    .single();
  if (error) throw error;
  const questionId = data.question_id;
  if (choices && choices.length > 0) {
    const choicesToInsert = choices.map((choice) => ({
      question_id: questionId, // 새로 저장된 질문의 ID
      choice_text: choice.choice_text,
      choice_position: choice.position,
      is_correct: choice.is_correct,
    }));

    const { error: choicesError } = await client
      .from("class_quiz_choices")
      .insert(choicesToInsert);

    if (choicesError) {
      console.error("Error saving choices:", choicesError);
    } else {
      console.log("Choices saved successfully.");
    }
  }
  return questionId;
};

export async function updateQuizQuestion(
  client: SupabaseClient,
  {
    questionId,
    text,
    point,
    type,
    position,
    choices,
    hint,
    minLength,
  }: {
    questionId: string;
    text: string;
    hint: string;
    point: string;
    type: "multiple_choice" | "short_answer" | "long_answer";
    position: string;
    choices: {
      choice_text: string;
      position: number;
      is_correct: boolean;
    }[];
    minLength: string;
  }
) {
  // 문제 수정
  await client
    .from("class_quiz_questions")
    .update({
      question_text: text,
      question_hint: hint,
      question_point: Number(point),
      question_type: type,
      question_position: Number(position),
      question_min_length: Number(minLength),
    })
    .eq("question_id", questionId);

  // 기존 선택지 삭제 후 재삽입 (간단한 방식)
  await client
    .from("class_quiz_choices")
    .delete()
    .eq("question_id", Number(questionId));

  await client.from("class_quiz_choices").insert(
    choices.map((choice) => ({
      question_id: Number(questionId),
      choice_text: choice.choice_text,
      choice_position: choice.position,
      is_correct: choice.is_correct,
    }))
  );
}

export const deleteClassQuestion = async (
  client: SupabaseClient<Database>,
  { questionId }: { questionId: string }
) => {
  const { data, error } = await client
    .from("class_quiz_questions")
    .delete()
    .eq("question_id", Number(questionId));
  if (error) throw error;
  return data;
};
