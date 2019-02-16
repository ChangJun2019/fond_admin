import React, { PureComponent } from 'react';
import { List, Icon } from 'antd';
import { connect } from 'dva';
import ArticleListContent from '@/components/ArticleListContent';
import styles from './Articles.less';
import AvatarList from '@/components/AvatarList';
import stylesProjects from "../../Posts/Projects.less";

@connect(({ user,loading }) => ({
  currentUserArticles:user.currentUserArticles,
  currentUserArticlesLoading:loading.effects["user/fetchUserArticles"]
}))
class Center extends PureComponent {

  render() {
    const { currentUserArticles:{list},currentUserArticlesLoading} = this.props;
    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
    );
    return (
      <List
        size="large"
        className={styles.articleList}
        rowKey="id"
        itemLayout="vertical"
        dataSource={list}
        loading={currentUserArticlesLoading}
        renderItem={item => (
          <List.Item
            key={item.id}
            actions={[
              <IconText type="star-o" text={item.visit_count} />,
              <IconText type="like-o" text={item.like_count} />,
              <IconText type="message" text={item.reply_count} />,
            ]}
            extra={<img width={272} height={250} alt="logo" src={item.cover} />}
          >
            <List.Item.Meta
              title={
                <a className={styles.listItemMetaTitle} href="#">
                  {item.titile}
                </a>
              }
              description={
                <div className={stylesProjects.avatarList} style={{marginLeft:"-40px"}}>
                  <AvatarList size="mini">
                    {item.collectors.map(collector => (
                      <AvatarList.Item
                        key={`${item.id}-avatar-${collector.user_avatar}`}
                        src={collector.user_avatar}
                        tips={collector.user_name}
                      />
                    ))}
                  </AvatarList>
                </div>
              }
            />
            <ArticleListContent data={item} />
          </List.Item>
        )}
      />
    );
  }
}

export default Center;
