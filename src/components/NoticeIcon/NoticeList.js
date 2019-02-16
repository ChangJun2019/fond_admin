import React from 'react';
import { Avatar, List } from 'antd';
import classNames from 'classnames';
import moment from "moment";
import styles from './NoticeList.less';


export default function NoticeList({
  data = [],
  onClick,
  onClear,
  title,
  locale,
  emptyText,
  emptyImage,
  showClear = true,
}) {
  if (data.length === 0) {
    return (
      <div className={styles.notFound}>
        {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
        <div>{emptyText || locale.emptyText}</div>
      </div>
    );
  }
  return (
    <div>
      <List className={styles.list}>
        {data.map((item, i) => {
          const itemCls = classNames(styles.item, {
            [styles.read]: item.read,
          });
          // eslint-disable-next-line no-nested-ternary
          const leftIcon = item.from_user.user_avatar ? (
            typeof item.from_user.user_avatar === 'string' ? (
              <Avatar className={styles.avatar} src={item.from_user.user_avatar} />
            ) : (
              item.from_user.user_avatar
            )
          ) : null;

          return (
            <List.Item className={itemCls} key={item.id || i} onClick={() => onClick(item)}>
              <List.Item.Meta
                className={styles.meta}
                avatar={<span className={styles.iconElement}>{leftIcon}</span>}
                title={
                  <div className={styles.title}>
                    {item.from_user.user_name}:
                  </div>
                }
                description={
                  <div>
                    <div className={styles.description} title={item.content}>
                      {item.content}
                    </div>
                    <div className={styles.datetime}>{moment.unix(item.create_time).format("YYYY-MM-DD HH:mm:ss")}</div>
                  </div>
                }
              />
            </List.Item>
          );
        })}
      </List>
      {showClear ? (
        <div className={styles.clear} onClick={onClear}>
          {locale.clear} {title}
        </div>
      ) : null}
    </div>
  );
}
