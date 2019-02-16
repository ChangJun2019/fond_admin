import React, { Component, Fragment } from "react";
import { formatMessage, FormattedMessage } from "umi/locale";
import { connect } from "dva";
import { List } from "antd";
// import { getTimeDistance } from '@/utils/utils';

const passwordStrength = {
  strong: (
    <font className="strong">
      <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
      Weak
    </font>
  )
};

@connect(({ loading, user }) => ({
  currentUser: user.currentUser,
  currentUserLoading: loading.effects["user/fetchCurrent"]
}))
class SecurityView extends Component {

  /**
   * 修改密码
   * @param currentUser
   */
  handleChangeUserPassword = (currentUser) => {
    const id = currentUser.id;
  };

  /**
   * 设置密码
   * @param currentUser
   */
  handleSetUserPassword = (currentUser) => {
    const id = currentUser.id;
  };


  getPWDView = (currentUser) => {
    if (currentUser.has_pawd) {
      return <a onClick={() => this.handleChangeUserPassword(currentUser)}>修改</a>;
    }
    return <a onClick={() => this.handleSetUserPassword(currentUser)}>设置</a>;
  };

  getData = (currentUser) => [
    {
      title: formatMessage({ id: "app.settings.security.password" }, {}),
      description: (
        <Fragment>
          {currentUser.has_pawd ? "您已设置了密码，账号更加安全" : <a>您可能是微信或者手机号登录用户,设置密码可以更安全！</a>}
        </Fragment>
      ),
      actions: [this.getPWDView(currentUser)]
    },
    {
      title: formatMessage({ id: "app.settings.security.phone" }, {}),
      description: (
        <Fragment>
          {formatMessage({ id: "app.settings.security.phone-description" })}：
          {currentUser.mobile}
        </Fragment>
      ),
      actions: [
        <a>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>
      ]
    },
    {
      title: formatMessage({ id: "app.settings.security.email" }, {}),
      description: (
        <Fragment>
          {formatMessage({ id: "app.settings.security.email-description" })}：
          {currentUser.email ? currentUser.email : <a>您还有没绑定邮箱</a>}
        </Fragment>
      ),
      actions: [
        <a>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>
      ]
    }
  ];

  render() {
    const { currentUser } = this.props;
    return (
      <Fragment>
        <List
          itemLayout="horizontal"
          dataSource={this.getData(currentUser)}
          renderItem={item => (
            <List.Item actions={item.actions}>
              <List.Item.Meta title={item.title} description={item.description} />
            </List.Item>
          )}
        />
      </Fragment>
    );
  }
}

export default SecurityView;
