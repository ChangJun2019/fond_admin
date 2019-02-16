import React from 'react';
import moment from 'moment';
import { Avatar } from 'antd';
import styles from './index.less';

const ArticleListContent = ({ data : {desc, created_user, from_topic, update_time } }) => (
  <div className={styles.listContent}>
    <div className={styles.description}>{desc}</div>
    <div className={styles.extra}>
      <Avatar src={created_user.user_avatar} size="small" />
      <a href="#">{created_user.user_name}</a> 发布在 <a href="#">{from_topic.topics_name}</a>
      <em>{moment.unix(update_time).format('YYYY-MM-DD HH:mm:ss')}</em>
    </div>
  </div>
);

export default ArticleListContent;
