import {
  getfeed,
  createPost,
  likePost,
  unlikePost,
} from "../services/post.api";
import { useContext } from "react";
import { PostContext } from "../../post/post.context";

export const usePost = () => {
  const context = useContext(PostContext);

  const { Loading, setLoading, post, setPost, feed, setfeed } = context;

  const handleGetFeed = async () => {
    setLoading(true);
    const data = await getfeed();
    setfeed(data.posts);
    setLoading(false);
  };

  const handleCreatePost = async (imageFile, caption) => {
    setLoading(true);
    const data = await createPost(imageFile, caption);
    setfeed([data.post, ...feed]);
    setLoading(false);
  };

  const handleLike = async (post) => {
    const data = await likePost(post);
    await handleGetFeed();
  };

  const handleUnLike = async (post) => {
    const data = await unlikePost(post);
    await handleGetFeed();
  };



  return {
    Loading,
    feed,
    post,
    handleGetFeed,
    handleCreatePost,
    handleLike,
    handleUnLike,
  };
};
