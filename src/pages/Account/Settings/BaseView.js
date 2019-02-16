import React, { Component, Fragment } from "react";
import { formatMessage, FormattedMessage } from "umi/locale";
import { Form, Input, Upload, Select, Button, message } from "antd";
import router from "umi/router";
import { connect } from "dva";
import styles from "./BaseView.less";
import GeographicView from "./GeographicView";
import request from "@/utils/request";
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const handleChange = (info) => {
  console.log(info);
};


const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback("Please input your province!");
  }
  if (!city.key) {
    callback("Please input your city!");
  }
  callback();
};

const validatorPhone = (rule, value, callback) => {
  if (!(/^1[34578]\d{9}$/.test(value))) {
    callback("手机号码格式不正确");
  }
  callback();
};

@connect(({ global, user, loading }) => ({
  currentUser: user.currentUser,
  qiniutoken: global.qntoken,
  submitting: loading.effects["user/fetchUpdateUserInfo"]
}))
@Form.create()
class BaseView extends Component {
  componentDidMount() {
    this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    const url = "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png";
    return url;
  }

  getViewDom = ref => {
    this.view = ref;
  };


  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log(values);
        dispatch({
          type: "user/fetchUpdateUserInfo",
          payload: values
        });
        message.success("修改信息成功，即将前往个人中心", 3).then(() => {
          router.replace("/account/center");
        });
      }
    });
  };

  handleChange = info => {
    const { dispatch } = this.props;
    if (info.file.status !== "uploading") {
      console.log(info);
      const avatar = `http://image.52chinaweb.com/${info.file.response.key}`;
      dispatch({
        type: "user/fetchUpdateUserAvatar",
        payload: { avatar }
      });
      message.success("修改头像成功", 3);
    }
  };

  render() {
    const {
      form: { getFieldDecorator }
    } = this.props;
    const { submitting, qiniutoken, currentUser } = this.props;
    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            <FormItem label={formatMessage({ id: "app.settings.basic.nickname" })}>
              {getFieldDecorator("nickname", {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: "app.settings.basic.nickname-message" }, {})
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: "app.settings.basic.gender" })}>
              {getFieldDecorator("gender", {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: "app.settings.basic.gender-message" }, {})
                  }
                ]
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="0">其它</Option>
                  <Option value="1">男</Option>
                  <Option value="2">女</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: "app.settings.basic.profile" })}>
              {getFieldDecorator("sig", {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: "app.settings.basic.profile-message" }, {})
                  }
                ]
              })(
                <Input.TextArea
                  placeholder={formatMessage({ id: "app.settings.basic.profile-placeholder" })}
                  rows={4}
                />
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: "app.settings.basic.country" })}>
              {getFieldDecorator("country", {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: "app.settings.basic.country-message" }, {})
                  }
                ]
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="中国">中国</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: "app.settings.basic.pro" })}>
              {getFieldDecorator("pro", {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: "app.settings.basic.pro-message" }, {})
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label={formatMessage({ id: "app.settings.basic.geographic" })}>
              {getFieldDecorator("geographic", {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: "app.settings.basic.geographic-message" }, {})
                  },
                  {
                    validator: validatorGeographic
                  }
                ]
              })(<GeographicView />)}
            </FormItem>
            <FormItem label={formatMessage({ id: "app.settings.basic.phone" })}>
              {getFieldDecorator("mobile", {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: "app.settings.basic.phone-message" }, {})
                  },
                  { validator: validatorPhone }
                ]
              })(<Input />)}
            </FormItem>
            <Button type="primary" htmlType="submit" loading={submitting}>
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <div className={styles.avatar_title}>
            <FormattedMessage id="app.settings.basic.avatar" defaultMessage="Avatar" />
          </div>
          <div className={styles.avatar}>
            <img src={currentUser.avatar} alt="avatar" />
          </div>
          <Upload name="file" action="http://up.qiniu.com" data={{ token: qiniutoken }} onChange={this.handleChange}>
            <div className={styles.button_view}>
              <Button icon="upload">
                <FormattedMessage id="app.settings.basic.change-avatar" defaultMessage="Change avatar" />
              </Button>
            </div>
          </Upload>
        </div>
      </div>
    );
  }
}

export default BaseView;
