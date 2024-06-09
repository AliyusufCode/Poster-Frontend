import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";
import {
  fetchComments,
  fetchRemoveComment,
} from "../redux/slices/CommentSlice";
import { useDispatch } from "react-redux";

export const CommentsBlock = ({
  items,
  children,
  userId,
  postId,
  isLoading = true,
}) => {
  const getComments = () => {
    return items.filter((el) => el.post?._id === postId);
  };
  const dispatch = useDispatch();
  const onClickRemove = async (id) => {
    if (window.confirm("Удалить комментарий?")) {
      await dispatch(fetchRemoveComment(id));
      await dispatch(fetchComments());
    }
  };
  const comments = getComments();

  const formatCreatedAt = (createdAt) => {
    const date = new Date(createdAt);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const formattedDate = `${month}.${day}  ${hours}:${minutes}`;
    return formattedDate;
  };
  return (
    <SideBlock title="Комментарии">
      <List>
        {isLoading ? (
          [...Array(5)]
        ) : (
          <React.Fragment>
            {comments &&
              comments.map((el, i) => (
                <ListItem alignItems="flex-start" key={i}>
                  <ListItemAvatar>
                    {isLoading ? (
                      <Skeleton variant="circular" width={40} height={40} />
                    ) : (
                      <Avatar alt={el.user.fullName} src={el.user.avatarUrl} />
                    )}
                  </ListItemAvatar>
                  {isLoading ? (
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Skeleton variant="text" height={25} width={120} />
                      <Skeleton variant="text" height={18} width={230} />
                    </div>
                  ) : (
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <span>{el.user.fullName}</span>
                          <span
                            style={{
                              marginLeft: 10,
                              color: "gray",
                              fontSize: 11,
                            }}
                          >
                            {formatCreatedAt(el.createdAt)}
                          </span>
                        </React.Fragment>
                      }
                      secondary={el.text}
                    />
                  )}
                  {el.user._id === userId && (
                    <p
                      style={{ cursor: "pointer" }}
                      onClick={() => onClickRemove(el._id)}
                    >
                      Удалить
                    </p>
                  )}
                </ListItem>
              ))}
            <Divider variant="inset" component="li" />
          </React.Fragment>
        )}
      </List>
      {children}
    </SideBlock>
  );
};
