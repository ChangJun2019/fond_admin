/**
 * @Time: 2018/12/23 17:46
 * @Author: Chang Jun
 * @Email: 52chinaweb@gmail.com
 * @desc: 发表动态
 */

import React, { PureComponent } from "react";
import { formatMessage, FormattedMessage } from "umi/locale";
import "braft-editor/dist/index.css";
import BraftEditor from "braft-editor";
import { connect } from "dva";
import router from 'umi/router';
import {
  Form,
  Input,
  Button,
  Card,
  Radio,
  Icon,
  Upload,
  Cascader, Modal
} from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import styles from "./PostArticles.less";
import Result from "@/components/Result";

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ global, posts, loading }) => ({
  submitting: loading.effects["posts/submitPostsForm"],
  qiniutoken: global.qntoken,
  allTopics: posts.all_topics
}))
@Form.create()
class PostArticles extends PureComponent {
  state = { visible: false };

  /**
   * 表单提交
   * @param e
   */
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const coverkey = values.cover[0].response.key;
      const coverurl = `http://image.52chinaweb.com/${coverkey}`;
      const sort = values.sort.slice(-1).join();
      const data = {
        sort,
        cover: coverurl,
        title: values.title,
        atype: values.atype,
        desc: values.desc,
        content: values.content.toHTML(),
        type: 1
      };
      if (err) return;
      if (!err) {
        dispatch({
          type: "posts/submitPostsForm",
          payload: data
        });
        this.setState({
          visible: true
        });
      }
    });
  };

  handleDone = () => {
    this.setState({
      visible: false
    });
    this.props.form.resetFields();
    this.props.form.resetFields(['content']);
  };

  handleToUserCenter = () => {
    router.replace('/account/center');
  };

  normFile = (e) => {
    console.log(e);
    return e.fileList.slice(-1);
  };

  render() {
    const { submitting, qiniutoken, allTopics, form: { getFieldDecorator } } = this.props;
    const { visible } = this.state;
    const QINIU_SERVER = "http://up.qiniu.com";
    const qndata = { token: qiniutoken };
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 }
      }
    };
    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 }
      }
    };


    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          在这里你可以发布文章、发布相关动态、发布视频,这是一个非常不错的社区。
        </p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{" "}
            快速开始
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{" "}
            产品简介
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{" "}
            产品文档
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );

    return (
      <PageHeaderWrapper title="发布文章" content={content} extraContent={extraContent}>
        <div>
          <Card bordered={false}>
            <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label={<FormattedMessage id="form.title.label" />}>
                {getFieldDecorator("title", {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: "validation.title.required" })
                  }
                ]
              })(<Input placeholder={formatMessage({ id: "form.title.placeholder" })} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="form.sort.label" />}>
                {getFieldDecorator("sort", {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: "validation.sort.required" })
                  }
                ]
              })(
                <Cascader options={allTopics} placeholder={formatMessage({ id: "form.sort.placeholder" })} />
              )}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="form.cover.label" />}>
                {getFieldDecorator("cover", {
                valuePropName: "fileList",
                getValueFromEvent: this.normFile,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: "validation.cover.required" })
                  }
                ]
              })(
                <Upload name="file" action={QINIU_SERVER} listType="picture" data={qndata}>
                  <Button>
                    <Icon type="upload" />{<FormattedMessage id="Click to upload" />}
                  </Button>
                </Upload>
              )}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id="form.state.label" />}>
                {getFieldDecorator("desc", {
                  rules: [
                    {
                      required: true,
                      max:150,
                      message: formatMessage({ id: "validation.state.content.required" })
                    }
                  ]
                })(
                  <TextArea rows={4} placeholder={formatMessage({ id: "form.state.content.placeholder" })} />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="form.article.label.content" />}
              >
                {getFieldDecorator("content", {
                validateTrigger: "onBlur",
                rules: [{
                  required: true,
                  validator: (_, value, callback) => {
                    if (value.isEmpty()) {
                      callback("请输入正文内容");
                    } else {
                      callback();
                    }
                  }
                }]
              })(
                <BraftEditor
                  className={styles.myEditor}
                  placeholder="请输入正文内容"
                />
              )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label={<FormattedMessage id="form.article.label.type" />}
                help={<FormattedMessage id="form.article.label.help" />}
              >
                <div>
                  {getFieldDecorator("atype", {
                  initialValue: "1"
                })(
                  <Radio.Group>
                    <Radio value="1">
                      <FormattedMessage id="form.article.radio.original" />
                    </Radio>
                    <Radio value="2">
                      <FormattedMessage id="form.article.radio.reprint" />
                    </Radio>
                    <Radio value="3">
                      <FormattedMessage id="form.article.radio.translate" />
                    </Radio>
                  </Radio.Group>
                )}
                </div>
              </FormItem>
              <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  <FormattedMessage id="form.submit" />
                </Button>
              </FormItem>
            </Form>
          </Card>
        </div>
        <Modal
          title={false}
          className={styles.standardListForm}
          width={640}
          destroyOnClose
          visible={visible}
          footer={null}
        >
          {!visible ? null : (<Result
            type="success"
            title="发布成功"
            description="恭喜您发布了一篇文章，再接再厉，继续加油啊！"
            actions={[
              <Button onClick={this.handleDone} key="1">
                继续发布
              </Button>,
              <Button type="primary" key="2" onClick={this.handleToUserCenter}>
                查看我的文章
              </Button>
            ]
            }
            className={styles.formResult}
          />)}
        </Modal>
      </PageHeaderWrapper>
    );


  };
}

export default PostArticles;
