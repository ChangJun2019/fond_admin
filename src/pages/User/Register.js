import React, { Component } from "react";
import { connect } from "dva";
import Link from "umi/link";
import router from "umi/router";
import { Form, Input, Button, Select, Row, Col, Popover, Progress, message } from "antd";
import styles from "./Register.less";


/**
 * @desc 注册组件
 */

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

/**
 * 密码强度验证
 * @type {{ok: *, pass: *, poor: *}}
 */
const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>
};

const passwordProgressMap = {
  ok: "success",
  pass: "normal",
  poor: "exception"
};

@connect(({ register, loading }) => ({
  register,
  submitting: loading.effects["register/submit"]
}))
@Form.create()
class Register extends Component {
  state = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: "",
    prefix: "86"
  };


  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /**
   * 获取验证码
   */
  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  /**
   * 获取用户设置密码的强度
   * @returns {string}
   */
  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue("password");
    if (value && value.length > 9) {
      return "ok";
    }
    if (value && value.length > 5) {
      return "pass";
    }
    return "poor";
  };

  /**
   * 注册提交
   * @param e
   */
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch,register } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      console.log(values);
      const registerForm = {
        account: values.username,
        password: values.password,
        mobile: values.mobile,
        captcha: values.captcha
      };
      console.log(registerForm);
      if (!err) {
        dispatch({
          type: "register/submit",
          payload: {
            ...registerForm
          }
        });

        const account = form.getFieldValue("username");
        if (register.status === "ok") {
          router.push({
            pathname: "/user/register-result",
            state: {
              account
            }
          });
        }

      }

    });
  };

  /**
   * 两次输入密码是否一致
   * @param e
   */
  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  /**
   * 检查两次密码输入是否一致
   * @param rule
   * @param value
   * @param callback
   */
  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("password")) {
      callback("两次输入的密码不匹配!");
    } else {
      callback();
    }
  };

  /**
   * 检查密码格式
   * @param rule
   * @param value
   * @param callback
   */
  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: "请输入密码！",
        visible: !!value
      });
      callback("error");
    } else {
      this.setState({
        help: ""
      });
      if (!visible) {
        this.setState({
          visible: !!value
        });
      }
      if (value.length < 6) {
        callback("error");
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(["confirm"], { force: true });
        }
        callback();
      }
    }
  };

  /**
   * 改变用户手机号区号
   * @param value
   */
  changePrefix = value => {
    this.setState({
      prefix: value
    });
  };

  /**
   * 渲染密码强度
   * @returns {null}
   */
  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue("password");
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, help, visible } = this.state;
    return (
      <div className={styles.main}>
        <h3>注册</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator("username", {
              rules: [{
                required: true,
                message: "请输入你的用户名"
              }]
            })(
              <Input size="large" placeholder="请输入你的用户名" />
            )}
          </FormItem>
          <FormItem help={help}>
            <Popover
              content={
                <div style={{ padding: "4px 0" }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请至少输入 6 个字符。请不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator("password", {
                rules: [
                  {
                    validator: this.checkPassword
                  }
                ]
              })(<Input size="large" type="password" placeholder="至少6位密码，区分大小写" />)}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator("confirm", {
              rules: [
                {
                  required: true,
                  message: "请确认密码！"
                },
                {
                  validator: this.checkConfirm
                }
              ]
            })(<Input size="large" type="password" placeholder="确认密码" />)}
          </FormItem>
          <FormItem>
            <InputGroup compact>
              <Select
                size="large"
                value={prefix}
                onChange={this.changePrefix}
                style={{ width: "20%" }}
              >
                <Option value="86">+86</Option>
                <Option value="87">+87</Option>
              </Select>
              {getFieldDecorator("mobile", {
                rules: [
                  {
                    required: true,
                    message: "请输入手机号！"
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: "手机号格式错误！"
                  }
                ]
              })(<Input size="large" style={{ width: "80%" }} placeholder="11位手机号" />)}
            </InputGroup>
          </FormItem>
          <FormItem>
            <Row gutter={8}>
              <Col span={16}>
                {getFieldDecorator("captcha", {
                  rules: [
                    {
                      required: true,
                      message: "请输入验证码！"
                    }
                  ]
                })(<Input size="large" placeholder="验证码" />)}
              </Col>
              <Col span={8}>
                <Button
                  size="large"
                  disabled={count}
                  className={styles.getCaptcha}
                  onClick={this.onGetCaptcha}
                >
                  {count ? `${count} s` : "获取验证码"}
                </Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              注册
            </Button>
            <Link className={styles.login} to="/User/Login">
              使用已有账户登录
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Register;
