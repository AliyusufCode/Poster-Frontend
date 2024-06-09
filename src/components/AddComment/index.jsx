import React, { useState } from "react";

import styles from "./AddComment.module.scss";

import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import axios from "../../axios";
import { fetchComments } from "../../redux/slices/CommentSlice";

export const Index = () => {
  const [isLoading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const { id } = useParams();
  const dispatch = useDispatch();
  const onSubmit = async () => {
    try {
      setLoading(true);
      const fields = {
        text: text,
        postId: id,
      };
      setText("");
      await axios.post("/comments", fields);
      await dispatch(fetchComments());
    } catch (err) {
      console.warn(err);
      alert("Ошибка при создании комментария");
    }
  };

  return (
    <>
      <div className={styles.root}>
        <Avatar classes={{ root: styles.avatar }} src="" />
        <div className={styles.form}>
          <TextField
            label="Написать комментарий"
            variant="outlined"
            maxRows={10}
            multiline
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={() => onSubmit()}>
            Отправить
          </Button>
        </div>
      </div>
    </>
  );
};
