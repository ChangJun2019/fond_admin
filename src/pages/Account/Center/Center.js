import React, { PureComponent } from "react";
import { connect } from "dva";
import Link from "umi/link";
import router from "umi/router";
import { Card, Row, Col, Icon, Avatar, Tag, Divider, Spin, Input, message } from "antd";
import GridContent from "@/components/PageHeaderWrapper/GridContent";
import styles from "./Center.less";

@connect(({ loading, user }) => ({
  listLoading: loading.effects["user/fetchCurrentUserArticles"],
  currentUser: user.currentUser,
  currentFollowedTopics: user.currentFollowedTopics,
  currentUserArticles:user.currentUserArticles,
  currentUserStates:user.currentUserStates,
  currentUserVStates:user.currentUserVStates,
  currentUserLoading: loading.effects["user/fetchCurrent"],
  followedTopicsLoading: loading.effects["user/fetchCurrentFollowedTopics"]
}))
class Center extends PureComponent {
  state = {
    inputVisible: false,
    inputValue: ""
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "user/fetchCurrent"
    });
    dispatch({
      type: "user/fetchCurrentFollowedTopics"
    });
    dispatch({
      type: "user/fetchUserArticles"
    });
    dispatch({
      type:"user/fetchUserStates"
    });
    dispatch({
      type:"user/fetchUserVStates"
    })
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case "articles":
        router.push(`${match.url}/articles`);
        break;
      case "states":
        router.push(`${match.url}/states`);
        break;
      case "vstates":
        router.push(`${match.url}/vstates`);
        break;
      default:
        break;
    }
  };

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  };

  saveInputRef = input => {
    this.input = input;
  };

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { dispatch } = this.props;
    const { inputValue } = this.state;
    if (inputValue.length >= 8) {
      message.error("标签内容过长");
      this.setState({ inputValue: "", inputVisible: false });
      return;
    }
    if (inputValue.length === 0) {
      message.error("标签内容不能为空");
      this.setState({ inputVisible: false });
      return;
    }
    message.success("创建标签成功");
    dispatch({
      type: "user/fetchAddUserTags",
      payload: {
        tag_title: inputValue
      }
    });
    this.setState({ inputValue: "", inputVisible: false });
  };

  render() {
    const {  inputVisible, inputValue } = this.state;
    const {
      listLoading,
      currentUser,
      currentUserLoading,
      currentFollowedTopics,
      followedTopicsLoading,
      currentUserArticles,
      currentUserStates,
      currentUserVStates,
      match,
      location,
      children
    } = this.props;

    const operationTabList = [
      {
        key: "articles",
        tab: (
          <span>
            文章 <span style={{ fontSize: 14 }}>({currentUserArticles.count})</span>
          </span>
        )
      },
      {
        key: "states",
        tab: (
          <span>
            动态 <span style={{ fontSize: 14 }}>({currentUserStates.count})</span>
          </span>
        )
      },
      {
        key: "vstates",
        tab: (
          <span>
            视频动态 <span style={{ fontSize: 14 }}>({currentUserVStates.count})</span>
          </span>
        )
      }
    ];

    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={currentUserLoading}>
              {currentUser && Object.keys(currentUser).length ? (
                <div>
                  <div className={styles.avatarHolder}>
                    <img alt="" src={currentUser.avatar} />
                    <div className={styles.name}>{currentUser.nickname}</div>
                    <div>{currentUser.sig || "这个人很懒，没有留下什么"}</div>
                  </div>
                  <div className={styles.detail}>
                    <p>
                      <i className={styles.title} />
                      {currentUser.pro}
                    </p>
                    <p>
                      <i className={styles.group} />
                      {currentUser.mobile}
                    </p>
                    <p>
                      <i className={styles.address} />
                      {currentUser.geographic ? `${currentUser.country}-${currentUser.geographic.province.label}-${currentUser.geographic.city.label}` : "地球"}
                    </p>
                  </div>
                  <Divider dashed />
                  <div className={styles.tags}>
                    <div className={styles.tagsTitle}>标签</div>
                    {currentUser.tags.map((item, index) => (
                      <Tag key={index}>{item}</Tag>
                    ))}
                    {inputVisible && (
                      <Input
                        ref={this.saveInputRef}
                        type="text"
                        size="small"
                        style={{ width: 78 }}
                        value={inputValue}
                        onChange={this.handleInputChange}
                        onBlur={this.handleInputConfirm}
                        onPressEnter={this.handleInputConfirm}
                      />
                    )}
                    {!inputVisible && (
                      <Tag
                        onClick={this.showInput}
                        style={{ background: "#fff", borderStyle: "dashed" }}
                      >
                        <Icon type="plus" />
                      </Tag>
                    )}
                  </div>
                  <Divider style={{ marginTop: 16 }} dashed />
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>关注的主题</div>
                    <Spin spinning={followedTopicsLoading}>
                      <Row gutter={36}>
                        {currentFollowedTopics.map(item => (
                          <Col key={item.topic_id} lg={24} xl={12}>
                            <Link to="#">
                              <Avatar size="small" src={item.cover} />
                              {item.topic_name}
                            </Link>
                          </Col>
                        ))}
                      </Row>
                    </Spin>
                  </div>
                </div>
              ) : (
                "loading..."
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
              tabList={operationTabList}
              activeTabKey={location.pathname.replace(`${match.path}/`, "")}
              onTabChange={this.onTabChange}
              loading={listLoading}
            >
              {children}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;
