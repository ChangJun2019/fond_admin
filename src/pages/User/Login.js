import React, { Component } from "react";
import { connect } from "dva";
import Link from "umi/link";
import { Checkbox, Alert } from "antd";
import Login from "@/components/Login";
import styles from "./Login.less";

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

/**
 * @desc 登录组件
 */


@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects["login/login"]
}))
class LoginPage extends Component {
  state = {
    type: "account",  // 选项卡切换状态
    autoLogin: true // 是否自动登录
  };

  /**
   * 切换登录选项卡
   * @param type
   */
  onTabChange = type => {
    this.setState({ type });
  };

  /**
   * 获取手机验证码
   * @returns {Promise<any>}
   */
  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(["mobile"], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: "login/getCaptcha",
            payload: values.mobile
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  /**
   * 登录提交
   * @param err
   * @param values
   */
  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      const loginForm = {
        account: values.userName,
        password: values.password
      };
      dispatch({
        type: "login/login",
        payload: {
          ...loginForm
        }
      });
    }
  };

  /**
   * 切换是否自动登录状态
   * @param e
   */
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked
    });
  };

  /**
   * 渲染弹出框错误提示组件
   * @param content
   * @returns {*}
   */
  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="账户密码登录">
            {login.status === "error" &&
            login.type === "account" &&
            !submitting &&
            this.renderMessage("账户或密码错误！")}
            <UserName name="userName" placeholder="请输入你的用户名" />
            <Password
              name="password"
              placeholder="请输入密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <Tab key="mobile" tab="手机号登录">
            {login.status === "error" &&
            login.type === "mobile" &&
            !submitting &&
            this.renderMessage("验证码错误")}
            <Mobile name="mobile"  />
            <Captcha name="captcha" countDown={120} onGetCaptcha={this.onGetCaptcha} />
          </Tab>
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              自动登录
            </Checkbox>
          </div>
          <Submit loading={submitting}>登录</Submit>
          <div className={styles.other}>
            <Link className={styles.register} to="/User/Register">
              注册账户
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
