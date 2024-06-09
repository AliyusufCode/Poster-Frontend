import { useState } from "react";
import clsx from "clsx";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import EyeIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import CommentIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";

import styles from "./Post.module.scss";
import { UserInfo } from "../UserInfo";
import { PostSkeleton } from "./Skeleton";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchRemovePost } from "../../redux/slices/PostSlice";
import ReactMarkdown from "react-markdown";

export const Post = ({
  _id,
  title,
  createdAt,
  imageUrl,
  user,
  viewsCount,
  commentsCount,
  tags,
  children,
  isFullPost,
  isLoading,
  text,
  isEditable,
}) => {
  const [isDescriptionClick, setIsDescriptionClick] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  if (isLoading) {
    return <PostSkeleton />;
  }
  const onClickRemove = () => {
    if (window.confirm("Удалить статью?")) {
      dispatch(fetchRemovePost(_id));
    }
  };
  const splitTags = tags.map((el) => el.split(","));

  const date = new Date(createdAt);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;

  const handleCommentsClick = () => {
    navigate(`/posts/${_id}`);
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className={clsx(styles.root, { [styles.rootFull]: isFullPost })}>
      {isEditable && (
        <div className={styles.editButtons}>
          <Link to={`/posts/${_id}/edit`}>
            <IconButton color="primary">
              <EditIcon />
            </IconButton>
          </Link>
          <IconButton onClick={onClickRemove} color="secondary">
            <DeleteIcon />
          </IconButton>
        </div>
      )}
      {imageUrl && (
        <Link to={`/posts/${_id}`}>
          <img
            className={clsx(styles.image, { [styles.imageFull]: isFullPost })}
            src={imageUrl}
            alt={title}
          />
        </Link>
      )}
      <div className={styles.wrapper}>
        <UserInfo {...user} additionalText={formattedDate} />
        <div className={styles.indention}>
          <h2
            className={clsx(styles.title, { [styles.titleFull]: isFullPost })}
          >
            {isFullPost ? title : <Link to={`/posts/${_id}`}>{title}</Link>}
          </h2>
          <ul className={styles.tags}>
            {splitTags.map((name) => (
              <li key={name}>
                <Link to={`/tags/${name}`}>#{name}</Link>
              </li>
            ))}
          </ul>
          {children ? (
            <div className={styles.content}>{children}</div>
          ) : (
            <p>
              {isDescriptionClick ? (
                <ReactMarkdown children={text} />
              ) : (
                <ReactMarkdown
                  children={
                    `${text.slice(0, 100)}` +
                    `${text.length > 100 ? "..." : ""}`
                  }
                />
              )}
              {text.length > 100 && (
                <span
                  onClick={() => setIsDescriptionClick(!isDescriptionClick)}
                  className={styles.span}
                >
                  {isDescriptionClick
                    ? "Скрыть описание"
                    : "Подробное описание"}
                </span>
              )}
            </p>
          )}
          <ul className={styles.postDetails}>
            <li>
              <EyeIcon />
              <span>{viewsCount}</span>
            </li>
            <li>
              {location.pathname === "/" && (
                <p
                  className={styles.comment}
                  onClick={() => handleCommentsClick(_id)}
                >
                  <CommentIcon />
                  {commentsCount}
                </p>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
