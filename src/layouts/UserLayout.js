import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import styles from './UserLayout.less';
import logo from '../assets/logo.svg';
import wifi from '../assets/wifi.svg';

const links = [
  {
    key: 'help',
    title: '帮助',
    href: '',
  },
  {
    key: 'privacy',
    title: '隐私',
    href: '',
  },
  {
    key: 'terms',
    title: '条款',
    href: '',
  },
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2018 ChangJun@China
  </Fragment>
);

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        <img src={wifi} className={styles.wifi} alt="" />
        <div className={styles.userimg}>
          <div className={styles.iconbox}>
            <div className={styles.line}>
              <Icon type="search" className={styles.iconstyle} />
              关注你的兴趣所在
            </div>
            <div className={styles.line}>
              <Icon type="team" className={styles.iconstyle} />
              听听大家在谈论什么
            </div>
            <div className={styles.line}>
              <Icon type="message" className={styles.iconstyle} />
              加入他们
            </div>
          </div>
        </div>
        <div className={styles.userbox}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>Fond Admin</span>
                </Link>
              </div>
              <div className={styles.desc}>52chiaweb</div>
            </div>
            {children}
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </div>
    );
  }
}

export default UserLayout;
