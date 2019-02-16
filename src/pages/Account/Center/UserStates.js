import React, { PureComponent } from "react";
import { List, Card, Carousel, Icon, Dropdown, Menu } from "antd";
import { connect } from "dva";
import moment from "moment";
import stylesProjects from "../../Posts/Projects.less";
import styles from "../../Posts/CardList.less";


@connect(({ user }) => ({
  currentUserStates: user.currentUserStates
}))
class Center extends PureComponent {


  render() {
    const { currentUserStates: { list } } = this.props;

    const getImagesContent = (item) => (
      <Carousel effect="fade" autoplay>{
          item.map((item, index) => (
            <img key={index} height={270} src={item} alt="" />
          ))
        }
      </Carousel>);

    function MoreBtn(record) {
      return (
        <Dropdown
          overlay={
            <Menu onClick={({ key }) => editAndDelete(key, record)}>
              <Menu.Item key="edit">编辑</Menu.Item>
              <Menu.Item key="contact">联系管理员</Menu.Item>
            </Menu>
          }
        >
          <a>
            更多 <Icon type="down" />
          </a>
        </Dropdown>
      );
    }

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8 }} />
        {text}
      </span>
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
              cover={getImagesContent(item.images)}
              actions={[
                <IconText type="star-o" text={item.visit_count} />,
                <IconText type="like-o" text={item.like_count} />,
                <IconText type="message" text={item.reply_count} />,
                <MoreBtn />
              ]}
            >
              <Card.Meta
                title={<a>{item.titile}</a>}
                avatar={<img alt="" className={styles.cardAvatar} src={item.created_user.user_avatar} />}
                description={item.content}
              />
              <div className={stylesProjects.cardItemContent}>
                <span>{moment.unix(item.update_time).fromNow()}</span>
                <div className={stylesProjects.avatarList}>
                  {item.from_topic.topics_name}
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
