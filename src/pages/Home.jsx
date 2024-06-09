import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import TagIcon from "@mui/icons-material/Tag";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, fetchTags } from "../redux/slices/PostSlice";
import { useLocation, useParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { fetchComments } from "../redux/slices/CommentSlice";

export const Home = () => {
  const dispatch = useDispatch();
  const { tags, posts } = useSelector((state) => state.posts);
  const userData = useSelector((state) => state.auth.data);
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";
  const location = useLocation();

  useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
    dispatch(fetchComments());
  }, []);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const { tag } = useParams();
  const loc = location.pathname.includes("/tags");

  const [selectedTab, setSelectedTab] = useState("new");
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  const filteredPosts = isPostsLoading ? [...Array(5)] : posts.items;

  const sortedPosts = filteredPosts
    .filter((obj) => (loc ? obj?.tags.includes(tag) : true))
    .sort((a, b) => {
      if (selectedTab === "new") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (selectedTab === "popular") {
        return b.viewsCount - a.viewsCount;
      }
      return 0;
    });
  const { comments } = useSelector((state) => state.comments);

  const getCommentsCount = (comments, posts) => {
    const postIds = comments.map((comment) => comment.post._id);
    const commentsCount = postIds.reduce((acc, postId) => {
      acc[postId] = (acc[postId] || 0) + 1;
      return acc;
    }, {});

    return commentsCount;
  };

  const commentsCount = getCommentsCount(comments.items, sortedPosts);

  return (
    <>
      {!loc && (
        <Tabs
          style={{ marginBottom: 15 }}
          value={selectedTab}
          onChange={handleTabChange}
          aria-label="basic tabs example"
        >
          <Tab value="new" label="Новые" />
          <Tab value="popular" label="Популярные" />
        </Tabs>
      )}
      <Typography variant="h6" gutterBottom>
        {loc && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: 0,
              margin: 0,
            }}
          >
            <TagIcon />
            <span style={{ fontSize: 32 }}>{tag}</span>
          </div>
        )}
      </Typography>

      <Grid container spacing={4}>
        <Grid xs={windowWidth > 650 ? 8 : 19} item>
          {(isPostsLoading ? [...Array(5)] : sortedPosts)
            .filter((obj) => (loc ? obj?.tags.includes(tag) : true))
            .map((obj, index) =>
              isPostsLoading ? (
                <Post key={index} isLoading={true} />
              ) : (
                <Post
                  _id={obj._id}
                  key={index}
                  title={obj.title}
                  imageUrl={
                    obj.imageUrl
                      ? `${process.env.REACT_APP_API_URL}${obj.imageUrl}`
                      : ""
                  }
                  avatarUrl={
                    "https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
                  }
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  commentsCount={commentsCount[obj._id] || 0}
                  tags={obj.tags ? obj.tags : 1}
                  text={obj.text}
                  isEditable={userData?._id === obj.user._id}
                ></Post>
              )
            )}
        </Grid>
        {windowWidth > 650 && (
          <Grid xs={4} item>
            <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          </Grid>
        )}
      </Grid>
    </>
  );
};
