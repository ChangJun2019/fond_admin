import React, { PureComponent } from 'react';
import { List, Card } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import ReactPlayer from 'react-player'
import stylesProjects from '../../Posts/Projects.less';


@connect(({ user }) => ({
  currentUserVStates:user.currentUserVStates,
}))
class Center extends PureComponent {
  render() {
    const { currentUserVStates: { list } } = this.props;

    const getVideoContent = (item) => (
      <ReactPlayer
        url={item.videosrc}
        width='100%'
        style={{'background':"#000"}}
        controls
        muted
        height={276}
      />
      );

    return (
      <List
        className={stylesProjects.coverCardList}
        rowKey="id"
        grid={{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
        dataSource={list}
        renderItem={item => (
          <List.Item>
            <Card
              className={stylesProjects.card}
              hoverable
              cover={getVideoContent(item)}
            >
              <Card.Meta title={<a>{item.titile}</a>} description={item.content} />
              <div className={stylesProjects.cardItemContent}>
                <span>{moment.unix(item.update_time).fromNow()}</span>
                <div className={stylesProjects.avatarList}>
                  by {item.from_topic.topics_name}
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    );
  }
}

export default Center;
