/**
 * @Time: 2018/12/27 10:14
 * @Author: Chang Jun
 * @Email: 52chinaweb@gmail.com
 * @desc: 发表动态页面
 */

import React, { PureComponent } from "react";
import { formatMessage, FormattedMessage } from "umi/locale";
import router from 'umi/router';
import { connect } from "dva";
import {
  Form,
  Button,
  Card,
  Icon,
  Upload,
  Cascader,
  Modal,
  Input
} from "antd";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import styles from "./PostStates.less";
import Result from "@/components/Result";

const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ global, posts, loading }) => ({
  submitting: loading.effects["posts/submitPostsForm"],
  qiniutoken: global.qntoken,  // 七牛云上传图片token
  allTopics : posts.all_topics
}))
@Form.create()
class PostStates extends PureComponent {
  state = {
    previewVisible: false,  // 图片预览
    visible: false,
    previewImage: '',  // 预览图片地址
    fileList: []   // 图片文件列表
  };


  /**
   * 表单提交
   * @param e
   */
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const images = [];
      values.cover.forEach(x=>images.push(`http://image.52chinaweb.com/${x.response.key}`));
      const sort = values.sort.slice(-1).join();
      const data = {
        sort,
        images,
        title:values.title,
        content:values.content,
        type:2
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

  /**
   * 上传图片文件事件
   * @param e
   * @returns {*}
   */
  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    this.setState({
      fileList:e.fileList
    });
    return e && e.fileList;
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


  /**
   * 图片预览
   * @param file
   */
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  /**
   * 点击关闭图片预览事件
   */
  handleCancel = () => this.setState({ previewVisible: false });


  render() {
    const { submitting, qiniutoken,allTopics, form: { getFieldDecorator }} = this.props;
    const {previewVisible, previewImage,fileList, visible} = this.state;
    const QINIU_SERVER = "http://up.qiniu.com";
    const qndata = {
      token: qiniutoken
    };
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
    /**
     * 上传图片按钮
     */
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">{<FormattedMessage id="Click to upload" />}</div>
      </div>
    );

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
      <PageHeaderWrapper title="发布动态" content={content} extraContent={extraContent}>
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
                <Upload
                  name="file"
                  action={QINIU_SERVER}
                  listType="picture-card"
                  data={qndata}
                  onPreview={this.handlePreview}
                >
                  {fileList.length>=9?null:uploadButton}
                </Upload>
              )}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="form.submit" />
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Modal key="1" visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Modal
          title={false}
          className={styles.standardListForm}
          key="2"
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


export default PostStates
