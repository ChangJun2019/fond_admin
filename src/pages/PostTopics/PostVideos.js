/**
 * @Time: 2018/12/28 23:11
 * @Author: Chang Jun
 * @Email: 52chinaweb@gmail.com
 * @desc: 发表视频动态页面
 */
import React, { PureComponent } from "react";
import { formatMessage, FormattedMessage } from "umi/locale";
import { connect } from "dva";
import router from 'umi/router';
import {
  Form,
  Button,
  Card,
  Cascader,
  Input, Modal
} from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import styles from "./PostVideos.less";
import Result from "@/components/Result";

const FormItem = Form.Item;
const { TextArea } = Input;


@connect(({ loading,posts }) => ({
  submitting: loading.effects["posts/submitPostsForm"],
  allTopics : posts.all_topics
}))
@Form.create()
class PostVideos extends PureComponent {
  state={
    visible: false
  };

  /**
   * 表单提交
   * @param e
   */
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const sort = values.sort.slice(-1).join();
      const data = {
        sort,
        title:values.title,
        video:values.video,
        content:values.content,
        type:3
      };
      console.log(data);
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
  };

  handleToUserCenter = () => {
    router.replace('/account/center');
  };


  render() {
    const { submitting,allTopics, form: { getFieldDecorator }} = this.props;
    const { visible } = this.state;

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
      <PageHeaderWrapper title="发布视频动态" content={content} extraContent={extraContent}>
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
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.state.label" />}>
              {getFieldDecorator("content", {
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
            <FormItem {...formItemLayout} label={<FormattedMessage id="form.videosrc.label" />}>
              {getFieldDecorator("video", {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: "validation.video.required" })
                  }
                ]
              })(<Input placeholder={formatMessage({ id: "form.video.placeholder" })} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
            </FormItem>
          </Form>
        </Card>

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
            description="恭喜您发布了一个动态，再接再厉，继续加油啊！"
            actions={[
              <Button onClick={this.handleDone} key="1">
                继续发布
              </Button>,
              <Button type="primary" key="2" onClick={this.handleToUserCenter}>
                查看我的动态
              </Button>
            ]
            }
            className={styles.formResult}
          />)}
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default PostVideos
