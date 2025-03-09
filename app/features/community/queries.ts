import client from "~/supa-client";

export const getTopics = async () => {
  const { data, error } = await client.from("topics").select("name, slug");
  return data;
};

export const getPosts = async () => {
  const { data, error } = await client.from("community_post_list_view").select(`
   *
  `);
  if (error) throw new Error(error.message);
  return data;
};
