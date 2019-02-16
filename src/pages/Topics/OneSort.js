/**
 * @Time: 2018/12/21 18:02
 * @Author: Chang Jun
 * @Email: 52chinaweb@gmail.com
 * @desc: 一级分类管理
 */
import React, { PureComponent } from "react";
import { findDOMNode } from "react-dom";
import { connect } from "dva";
import { Card, Button, Icon, List, Modal, Form, Input, message } from "antd";
import { routerRedux } from "dva/router";
import Ellipsis from "@/components/Ellipsis";
import PageHeaderWrapper from "@/components/PageHeaderWrapper";
import Result from "@/components/Result";
import styles from "./OneSort.less";

const FormItem = Form.Item;
const { TextArea } = Input;

/**
 * @desc 一级分类、卡片展示一级分类、可对分类进行删除和编辑
 */

@connect(({ topics, user,loading }) => ({
  topics,
  currentUser:user.currentUser,
  loading: loading.models.topics
}))
@Form.create()
class OneSort extends PureComponent {
  state = {
    visible: false, // 控制模态框显示
    done: false  // 模态框是否完成
  };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 }
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: "topics/fetchOneTopics"  // 请求一级分类主题数据
    });
  }

  /**
   * 打开模态框
   */
  showModal = () => {
    this.setState({
      visible: true,
      current: undefined
    });
  };


  /**
   * 跳转到一级分类下面的二级主题
   * @param id
   */
  toSortDetail = id => {
    console.log(`获取到的父类id是${id}`);
    const { dispatch } = this.props;
    dispatch(routerRedux.push({
      pathname: "/topics/towtopics",
      params: id
    }));
  };

  /**
   * 弹出是否删除分组的模态框
   * @param id
   */
  handleDeleteSort = id => {
    Modal.confirm({
      title: "删除分组",
      content: "确定删除该分组吗",
      okText: "确认",
      cancelText: "取消",
      onOk: () => this.deleteSortItem(id)
    });
  };

  /**
   * 删除分组触发
   * @param id
   */
  deleteSortItem = id => {
    console.log(`删除分组id${id}`);
    const { dispatch } = this.props;
    dispatch({
      type: "topics/fetchDeleteTopic",
      payload: { id}
    });
    message.success('删除该分组成功');
  };

  /**
   * 打开编辑该分类信息的模态框
   * @param item
   */
  showEditModal = item => {
    this.setState({
      visible: true,
      current: item
    });
  };

  /**
   * 上传文件之后的响应
   * @param e
   * @returns {*}
   */
  // normFile = (e) => {
  //   console.log("Upload event:", e);
  //   if (Array.isArray(e)) {
  //     return e;
  //   }
  //   return e && e.fileList;
  // };

  /**
   * 模态框点击知道了
   */
  handleDone = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      done: false,
      visible: false
    });
  };

  /**
   * 模态框点击取消
   */
  handleCancel = () => {
    setTimeout(() => this.addBtn.blur(), 0);
    this.setState({
      visible: false
    });
  };

  /**
   * 表单提交信息
   * @param e
   */
  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, currentUser } = this.props;
    const { current } = this.state;
    const id = current ? current.id : "";
    setTimeout(() => this.addBtn.blur(), 0);
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({
        done: true
      });
      const user = {
        user_name:currentUser.nickname,
        user_avatar:currentUser.avatar
      };
      console.log(fieldsValue);
      if (!current) {
        dispatch({
          type: "topics/fetchCreateTopic",
          payload: { ...fieldsValue, create_user:user }
        });
      } else {
        dispatch({
          type: "topics/fetchUpdateTopic",
          payload: { id, ...fieldsValue, create_user:user }
        });
      }
    });
  };


  render() {
    const { topics: { OneTopics }, loading } = this.props; // 获取一级分类主题数据
    console.log(this.props);
    const { form: { getFieldDecorator } } = this.props;
    const { visible, done, current = {} } = this.state;

    /**
     * model 底部内容
     */
    const modalFooter = done
      ? { footer: null, onCancel: this.handleDone }
      : { okText: "保存", onOk: this.handleSubmit, onCancel: this.handleCancel };

    /**
     * 模态框内容
     * @returns {*}
     */
    const getModalContent = () => {
      if (done) {
        return (
          <Result
            type="success"
            title="操作成功"
            description="恭喜您，创建或者修改了一个主题信息。"
            actions={
              <Button type="primary" onClick={this.handleDone}>
                知道了
              </Button>
            }
            className={styles.formResult}
          />
        );
      }
      return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem label="分组名称" {...this.formLayout}>
            {getFieldDecorator("topic_name", {
              rules: [{ required: true, message: "请输入分组名称" }],
              initialValue: current.topic_name
            })(<Input placeholder="请输入" />)
            }
          </FormItem>
          <FormItem label="封面图片" {...this.formLayout}>
            {getFieldDecorator("cover", {
              rules: [{ required: true, message: "请输入图片链接地址" }],
              initialValue: current.cover
            })(<Input placeholder="请输入图片链接地址" />)
            }
          </FormItem>
          <FormItem {...this.formLayout} label="分类描述">
            {getFieldDecorator("desc", {
              rules: [{ message: "请输入至少五个字符的分类描述！", min: 5, max: 150 }],
              initialValue: current.desc
            })(<TextArea rows={4} placeholder="请输入分类描述" />)}
          </FormItem>
        </Form>
      );
    };


    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          没关系是由个人开发者ChangJun开发的一款社交分享类的app，在这里，你可以想到什么分享什么。这是一个非常不错的平台。
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
      <PageHeaderWrapper title="一级分类" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={["", ...OneTopics]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card
                    hoverable
                    className={styles.card}
                    actions={[
                      <a onClick={() => this.toSortDetail(item.id)}>详情</a>,
                      <a onClick={() => this.showEditModal(item)}>编辑</a>,
                      <a onClick={() => this.handleDeleteSort(item.id)}>删除</a>,
                      ]}
                  >
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.cover} />}
                      title={<a>{item.topic_name}<span style={{marginLeft:"120px",fontSize:"12px",color:"#999"}}>by {item.create_user.user_name}</span></a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.desc}
                        </Ellipsis>
                      }
                    />
                  </Card>
                </List.Item>
              ) : (
                <List.Item>
                  <Button
                    type="dashed"
                    className={styles.newButton}
                    onClick={this.showModal}
                    ref={component => {
                      /* eslint-disable */
                      this.addBtn = findDOMNode(component);
                      /* eslint-enable */
                    }}
                  >
                    <Icon type="plus" /> 新增分类
                  </Button>
                </List.Item>
              )
            }
          />
        </div>

        <Modal
          title={done ? null : `任务${current ? "编辑" : "添加"}`}
          className={styles.standardListForm}
          width={640}
          bodyStyle={done ? { padding: "72px 0" } : { padding: "28px 0 0" }}
          destroyOnClose
          visible={visible}
          {...modalFooter}
        >
          {getModalContent()}
        </Modal>
      </PageHeaderWrapper>
    );
  }

}

export default OneSort;
