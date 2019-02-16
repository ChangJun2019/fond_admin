import React, { PureComponent } from "react";
import { FormattedMessage, formatMessage } from "umi/locale";
import { Spin, Menu, Icon, Avatar, Tooltip, message } from "antd";
import moment from 'moment'
import NoticeIcon from "../NoticeIcon";
import HeaderDropdown from "../HeaderDropdown";
import SelectLang from "../SelectLang";
import styles from "./index.less";

export default class GlobalHeaderRight extends PureComponent {


  changeReadState = clickedItem => {
    // 点击之后修改消息状态
    const { dispatch } = this.props;
    dispatch({
      type: "global/changeNoticeReadState",
      payload: { id: clickedItem.id }
    });
    message.success("您已阅读成功");
    dispatch({
      type: "global/fetchNotices"
    });
  };

  render() {
    const {
      currentUser,
      fetchingNotices,
      onNoticeVisibleChange,
      onMenuClick,
      onNoticeClear,
      theme,
      notices
    } = this.props;
    notices.unread_count ? notices.unread_count : 0;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="userCenter">
          <Icon type="user" />
          <FormattedMessage id="menu.account.center" defaultMessage="account center" />
        </Menu.Item>
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          <FormattedMessage id="menu.account.settings" defaultMessage="account settings" />
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    let className = styles.right;
    if (theme === "dark") {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        <Tooltip title="时间">{moment().format('MMMM Do YYYY, h:mm:ss a')}</Tooltip>
        <Tooltip title={formatMessage({ id: "component.globalHeader.help" })}>
          <a
            target="_blank"
            href="https://pro.ant.design/docs/getting-started"
            rel="noopener noreferrer"
            className={styles.action}
          >
            <Icon type="question-circle-o" />
          </a>
        </Tooltip>
        <NoticeIcon
          className={styles.action}
          count={currentUser.message_count || 0}
          onItemClick={(item) => {
            this.changeReadState(item);
          }}
          locale={{
            emptyText: formatMessage({ id: "component.noticeIcon.empty" }),
            clear: formatMessage({ id: "component.noticeIcon.clear" })
          }}
          onClear={onNoticeClear}
          onPopupVisibleChange={onNoticeVisibleChange}
          loading={fetchingNotices}
          clearClose
        >
          <NoticeIcon.Tab
            count={notices.unread_count}
            list={notices.unread_messages}
            title={formatMessage({ id: "component.globalHeader.notification" })}
            name="notification"
            emptyText={formatMessage({ id: "component.globalHeader.notification.empty" })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
          />
          <NoticeIcon.Tab
            count={notices.read_count}
            list={notices.read_messages}
            title={formatMessage({ id: "component.globalHeader.message" })}
            name="message"
            emptyText={formatMessage({ id: "component.globalHeader.message.empty" })}
            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          />
        </NoticeIcon>
        {currentUser.nickname ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}
        <SelectLang className={styles.action} />
      </div>
    );
  }
}
